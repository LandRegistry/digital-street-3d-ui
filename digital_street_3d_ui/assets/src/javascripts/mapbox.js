mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGdpcmRsZXIiLCJhIjoiY2lteW85cm5lMDBmcnY5bTFxY2Zsc3c2OCJ9.VvO2DhAhOVrcjJ0Usw8JIA'
    let map = new mapboxgl.Map({
    style: 'mapbox://styles/mattgirdler/cjznu3ztu06m31clp2j37yybz',
    center:[-3.5208657, 50.7227184],
    zoom: 17.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
})

const buildingHeightSourceLayer = "exeter_buildings_with_height-0ygi87"
const floorplanLayers = [
    {layer: 'airspace-leasehold-a6g827', sourceLayer: 'airspace-a6g827'},
    {layer: 'freehold-diumk5', sourceLayer: 'osgb1000012317615-freehold-diumk5'},
    {layer: 'leasehold-0-83okhj', sourceLayer: 'osgb1000012317615-0-83okhj'},
    {layer: 'leasehold-1-54g9gf', sourceLayer: 'osgb1000012317615-1-54g9gf'},
    {layer: 'leasehold-2-ccs62k', sourceLayer: 'osgb1000012317615-2-ccs62k'},
    {layer: 'leasehold-3-8aah9q', sourceLayer: 'osgb1000012317615-3-8aah9q'}
]

const spatialUnitsDiv = document.getElementById('spatial-units')
const spatialUnits = JSON.parse(spatialUnitsDiv.innerHTML)[0]

map.on('load', function() {

    // Create array of building IDs with boundary/floorplan data
    const buildingIdsWithFloorplans = []
    for (let i in floorplanLayers) {
        // Ignore airspace layers
        if (!floorplanLayers[i].layer.includes('airspace')) {
            const features = map.querySourceFeatures('composite', {
                sourceLayer: floorplanLayers[i].sourceLayer,
            })
            for (let j in features) {
                if (!buildingIdsWithFloorplans.includes(features[j].properties.fid)) {
                    buildingIdsWithFloorplans.push(features[j].properties.fid)
                }
            }
        }
    }

    // Hide any buildings that have boundary/floorplan data 
    let buildingFilter = ["in", "fid"].concat(buildingIdsWithFloorplans)
    const buildingFeatures = map.querySourceFeatures('composite', {
        sourceLayer: buildingHeightSourceLayer,
        filter: buildingFilter
    })
    for (let i in buildingFeatures) {
        map.setFeatureState({id: buildingFeatures[i].id, source: 'composite', sourceLayer: buildingHeightSourceLayer}, {'hide': true})
        displayFloorplan(buildingFeatures[i].properties.fid)
    }

    // Create an overlay
    let titleInformationOverlay = document.getElementById('title-information-overlay')
    let toggleLayersOverlay = document.getElementById('toggle-layers-overlay')
    toggleLayersOverlay.style.display = 'block'

    // Display features after hiding the building geometry
    function displayFloorplan(buildingId) {
        for (let i in floorplanLayers) {
            map.setLayoutProperty(floorplanLayers[i].layer, 'visibility', 'visible')

            // Don't worry about extruding the airspace layer, this is extruded by default
            if (!floorplanLayers[i].layer.includes('airspace')) {
                // Get the features within the layer
                const features = map.querySourceFeatures('composite', {
                    sourceLayer: floorplanLayers[i].sourceLayer
                })

                for (let j in features) {
                    let baseHeight = 0
                    let extrusionHeight = 0

                    if (floorplanLayers[i].layer.includes('freehold')) {
                        extrusionHeight = 120

                        // TODO - Add a buffer to the freehold to avoid clipping
                    } else {
                        const buildingId = features[j].properties.fid
                        // Get building height from OS dataset
                        const buildingFeature = map.querySourceFeatures('composite', {
                            sourceLayer: buildingHeightSourceLayer,
                            filter: ["==", 'fid', buildingId]
                        })[0]
                        const buildingHeight = buildingFeature.properties.RelHmax 
    
                        // Generate feature height values based on building height
                        const floorHeight = buildingHeight / features[j].properties.num_floors
                        extrusionHeight = floorHeight * (features[j].properties.floor + 1)
                        baseHeight = floorHeight*features[j].properties.floor
                    }

                    // Extrude the features
                    map.setPaintProperty(floorplanLayers[i].layer, 'fill-extrusion-height', extrusionHeight, {validate: true})
                    map.setPaintProperty(floorplanLayers[i].layer, 'fill-extrusion-base', baseHeight, {validate: true})
                }
            } 
        }
    }

    function hideFloorplan(buildingId) {
        for (let i in floorplanLayers) {
            const features = map.querySourceFeatures('composite', {
                sourceLayer: floorplanLayers[i].sourceLayer, 
                filter: ["==", 'fid', buildingId]
            })
            if (features.length > 0) {
                map.setPaintProperty(floorplanLayers[i].layer, 'fill-extrusion-base', 0, {validate: true})
                map.setPaintProperty(floorplanLayers[i].layer, 'fill-extrusion-height', 0, {validate: true})
            }
        }
    }

    function highlightTitle(featureId) {

        let spatialUnit = getSpatialUnitById(featureId)
        let spatialUnitTitleNumber = spatialUnit['ba_units'][0]['name']
        let titleFeatureIds = getFeatureIdsByTitleNumber(spatialUnitTitleNumber)

        for (let i in floorplanLayers) {
            for (let j in titleFeatureIds) {
                const features = map.querySourceFeatures('composite', { 
                    sourceLayer: floorplanLayers[i].sourceLayer,
                    filter: ['==', 'id', titleFeatureIds[j]] 
                })

                for (let k in features) {
                    map.setFeatureState({id: features[k].id, source: 'composite', sourceLayer: floorplanLayers[i].sourceLayer}, {'highlight': true})
                }
            }
        }
    }

    function disableHighlightTitle() {
        for (let i in floorplanLayers) {
            titleInformationOverlay.style.display = 'none'
            map.removeFeatureState({source: 'composite', sourceLayer: floorplanLayers[i].sourceLayer})
        }
    }

    function getFeatureIdsByTitleNumber(titleNumber) {
        let featureIds = []
        for (let i in spatialUnits) {
            if (spatialUnits[i]['ba_units'][0]['name'] == titleNumber) {
                featureIds.push(spatialUnits[i]['id'])
            }
        }
        return featureIds
    }

    function getSpatialUnitById(featureId) {
        let result = spatialUnits.find(function(element) {
            return element.id == featureId
        })
        return result
    }

    // Toggle building polygons on/off
    // map.on('click', 'exeter-buildings-with-height', function (e) {
    //     const features = map.queryRenderedFeatures(e.point)
    //     const feature = features[0]
    //     if (map.getFeatureState({id: feature.id, source: 'composite', sourceLayer: buildingHeightSourceLayer}).hide) {
    //         hideFloorplan(feature.properties.fid)
    //         map.removeFeatureState({id: feature.id, source: 'composite', sourceLayer: buildingHeightSourceLayer}, 'hide')
    //     } else {
    //         map.setFeatureState({id: feature.id, source: 'composite', sourceLayer: buildingHeightSourceLayer}, {'hide': true})
    //         displayFloorplan(feature.properties.fid)
    //     }
    // })

    // Display title information from floorplans
    map.on('mousemove', function(e) {

        // Create array of floorplan style layers for filtering
        const layers = []
        for (let i in floorplanLayers) {
            layers.push(floorplanLayers[i].layer)
        }

        // Check if mouseover is on a floorplan layer
        const features = map.queryRenderedFeatures(e.point, { layers: layers })
        if (features.length > 0) {

            disableHighlightTitle()

            const currentFeature = features[0]

            highlightTitle(currentFeature.properties.id)
            
            let featureId = currentFeature.properties.id

            let spatialUnit = getSpatialUnitById(featureId)

            let BAUnits = []

            if (spatialUnit) {
                
                for (let BAUnit in spatialUnit['ba_units']) {
                    let currentBAUnit = spatialUnit['ba_units'][BAUnit]

                    let title = { 
                        address: spatialUnit['address'],
                        titleNumber: currentBAUnit['name'],
                        pricePaid: [],
                        rights: [],
                        restrictions: [],
                        responsibilities: []
                    }

                    // Prices Paid
                    for (let pricePaid in spatialUnit['price_paid']) {
                        let currentPricePaid = spatialUnit['price_paid'][pricePaid]
                        title['pricePaid'].push({
                            amount: currentPricePaid['amount'],
                            date: currentPricePaid['date']
                        })
                    }

                    // Rights
                    for (let right in currentBAUnit['rights']) {
                        let currentRight = currentBAUnit['rights'][right]
                        let newRight = {
                            rightId: currentRight['right_id'],
                            type: currentRight['type'],
                            description: currentRight['description'],
                            mortgages: [],
                            startDate: currentRight['start_date'],
                            endDate: currentRight['end_date']
                        }

                        if (currentRight['party']) {
                            newRight['party'] = {
                                name: currentRight['party']['name'],
                                type: currentRight['party']['type'],
                                partyId: currentRight['party']
                            }
                        }

                        title['rights'].push(newRight)
                    }

                    // Add restrictions
                    for (let restriction in currentBAUnit['restrictions']) {
                        let currentRestriction = currentBAUnit['restrictions'][restriction]
                        let newRestriction = {
                            type: currentRestriction['type'],
                            description: currentRestriction['description'],
                            startDate: currentRestriction['start_date'],
                            endDate: currentRestriction['end_date']
                        }

                        if (currentRestriction['party']) {
                            newRestriction['party'] = {
                                name: currentRestriction['party']['name'],
                                type: currentRestriction['party']['type'],
                                partyId: currentRestriction['party']
                            }
                        }
                        title['restrictions'].push(newRestriction)
                    }

                    // Add responsibilities
                    for (let responsibility in currentBAUnit['responsibilities']) {
                        let currentResponsibility = currentBAUnit['responsibilities'][responsibility]
                        let newResponsibility = {
                            type: currentResponsibility['type'],
                            description: currentResponsibility['description'],
                            startDate: currentResponsibility['start_date'],
                            endDate: currentResponsibility['end_date']
                        }

                        if (currentResponsibility['party']) {
                            newResponsibility['party'] = {
                                name: currentResponsibility['party']['name'],
                                type: currentResponsibility['party']['type'],
                                partyId: currentResponsibility['party']
                            }
                        }
                        title['responsibilities'].push(newResponsibility)
                    }
                    BAUnits.push(title)
                }
            } 

            // Create HTML for title details 
            titleInformationOverlay.innerHTML = ''

            // titleInformationOverlay.innerHTML = JSON.stringify(spatialUnit)
            let tenureTypeHeading = document.createElement('h1')
            tenureTypeHeading.textContent = BAUnits[0]['rights'][0]['type']
            titleInformationOverlay.appendChild(tenureTypeHeading)

            let titleNumberLabel = document.createElement('strong')
            titleNumberLabel.textContent = "Title number: "
            titleInformationOverlay.append(titleNumberLabel)
            let titleNumberText = document.createElement('span')
            titleNumberText.append(BAUnits[0]['titleNumber'])
            titleInformationOverlay.appendChild(titleNumberText)
            
            // Address data
            if (BAUnits[0]['address']) {
                let addressDiv = document.createElement('div')
                let addressLabel = document.createElement('strong')
                addressLabel.textContent = 'Address: '
                addressDiv.append(addressLabel)

                let addressText = document.createElement('span')
                addressText.textContent = BAUnits[0]['address']
                addressDiv.append(addressText)
                titleInformationOverlay.appendChild(addressDiv)
            }

            titleInformationOverlay.appendChild(document.createElement('hr'))

            // Price Paid data
            let pricesPaidDiv = document.createElement('div')
            if (BAUnits[0]['pricePaid'].length > 0) {
                let pricesPaidLabel = document.createElement('strong')
                pricesPaidLabel.textContent = 'Prices paid:'
                pricesPaidDiv.appendChild(pricesPaidLabel)

                for (let pricePaid in BAUnits[0]['pricePaid']) {
                    let pricePaidDiv = document.createElement('div')
                    pricePaidDiv.style = "margin-left: 10px;"

                    let pricePaidText = document.createElement('span')
                    pricePaidText.textContent = BAUnits[0]['pricePaid'][pricePaid]['date'] + " - " + BAUnits[0]['pricePaid'][pricePaid]['amount']
                    pricePaidDiv.appendChild(pricePaidText)
                    pricePaidDiv.appendChild(document.createElement('br'))

                    pricesPaidDiv.appendChild(pricePaidDiv)
                }
                titleInformationOverlay.appendChild(pricesPaidDiv)
                titleInformationOverlay.appendChild(document.createElement('hr'))
            }

            // Rights data
            let rightsDiv = document.createElement('div')
            if (BAUnits[0]['rights'].length > 0) {
                let rightsLabel = document.createElement('strong')
                rightsLabel.textContent = 'Rights:'
                rightsDiv.appendChild(rightsLabel)
                for (let right in BAUnits[0]['rights']) {
                    let rightDiv = document.createElement('div')
                    rightDiv.style = "margin-left: 10px;"

                    // Right Type
                    let rightTypeLabel  = document.createElement('strong')
                    rightTypeLabel.textContent = 'Type: '
                    rightDiv.appendChild(rightTypeLabel)

                    let rightTypeText = document.createElement('span')
                    rightTypeText.textContent = BAUnits[0]['rights'][right]['type']
                    rightDiv.appendChild(rightTypeText)
                    rightDiv.appendChild(document.createElement('br'))

                    // Right description
                    if (BAUnits[0]['rights'][right]['description']) {
                        let rightDescriptionLabel  = document.createElement('strong')
                        rightDescriptionLabel.textContent = 'Description: '
                        rightDiv.appendChild(rightDescriptionLabel)

                        let rightDescriptionText = document.createElement('span')
                        rightDescriptionText.textContent = BAUnits[0]['rights'][right]['description']
                        rightDiv.appendChild(rightDescriptionText)
                        rightDiv.appendChild(document.createElement('br'))
                    }

                    // If right is a leasehold, display the end date
                    console.log(BAUnits[0]['rights'][right])
                    if (BAUnits[0]['rights'][right]['endDate'] && BAUnits[0]['rights'][right]['type'].toLowerCase().includes('leasehold')) {
                        let rightEndLabel  = document.createElement('strong')
                        rightEndLabel.textContent = 'End date: '
                        rightDiv.appendChild(rightEndLabel)

                        let rightEndText = document.createElement('span')
                        rightEndText.textContent = BAUnits[0]['rights'][right]['endDate']
                        rightDiv.appendChild(rightEndText)
                        rightDiv.appendChild(document.createElement('br'))
                    }

                    // Right Party
                    let partyLabel  = document.createElement('strong')
                    partyLabel.textContent = 'Party: '
                    rightDiv.appendChild(partyLabel)

                    let partyText = document.createElement('span')
                    partyText.textContent = BAUnits[0]['rights'][right]['party']['name'] + " (" + BAUnits[0]['rights'][right]['party']['type'] + ")"

                    rightDiv.appendChild(partyText)
                    rightDiv.appendChild(document.createElement('hr'))

                    rightsDiv.appendChild(rightDiv)
                }
                titleInformationOverlay.appendChild(rightsDiv)
            }

            // Restrictions data
            let restrictionsDiv = document.createElement('div')
            if (BAUnits[0]['restrictions'].length > 0) {
                let restrictionsLabel = document.createElement('strong')
                restrictionsLabel.textContent = 'Restrictions:'
                restrictionsDiv.appendChild(restrictionsLabel)
                for (restriction in BAUnits[0]['restrictions']) {
                    let restrictionDiv = document.createElement('div')
                    restrictionDiv.style = "margin-left: 10px;"

                    // Restriction Type
                    let restrictionTypeLabel  = document.createElement('strong')
                    restrictionTypeLabel.textContent = 'Type: '
                    restrictionDiv.appendChild(restrictionTypeLabel)

                    let restrictionTypeText = document.createElement('span')
                    restrictionTypeText.textContent = BAUnits[0]['restrictions'][restriction]['type']
                    restrictionDiv.appendChild(restrictionTypeText)
                    restrictionDiv.appendChild(document.createElement('br'))

                    // Restriction description
                    if (BAUnits[0]['restrictions'][restriction]['description']) {
                        let restrictionDescriptionLabel  = document.createElement('strong')
                        restrictionDescriptionLabel.textContent = 'Description: '
                        restrictionDiv.appendChild(restrictionDescriptionLabel)

                        let restrictionDescriptionText = document.createElement('span')
                        restrictionDescriptionText.textContent = BAUnits[0]['restrictions'][restriction]['description']
                        restrictionDiv.appendChild(restrictionDescriptionText)
                        restrictionDiv.appendChild(document.createElement('br'))
                    }

                    // Restriction Party
                    let partyLabel  = document.createElement('strong')
                    partyLabel.textContent = 'Party: '
                    restrictionDiv.appendChild(partyLabel)

                    let partyText = document.createElement('span')
                    partyText.textContent = BAUnits[0]['restrictions'][restriction]['party']['name'] + " (" + BAUnits[0]['restrictions'][restriction]['party']['type'] + ")"

                    restrictionDiv.appendChild(partyText)
                    restrictionDiv.appendChild(document.createElement('hr'))

                    restrictionsDiv.appendChild(restrictionDiv)
                }
                titleInformationOverlay.appendChild(restrictionsDiv)
            }

            // Responsibilities data
            let responsibilitiesDiv = document.createElement('div')
            if (BAUnits[0]['responsibilities'].length > 0) {
                let responsibilitiesLabel = document.createElement('strong')
                responsibilitiesLabel.textContent = 'Responsibilities:'
                responsibilitiesDiv.appendChild(responsibilitiesLabel)
                for (responsibility in BAUnits[0]['responsibilities']) {
                    let responsibilityDiv = document.createElement('div')
                    responsibilityDiv.style = "margin-left: 10px;"

                    // Responsibility Type
                    let responsibilityTypeLabel  = document.createElement('strong')
                    responsibilityTypeLabel.textContent = 'Type: '
                    responsibilityDiv.appendChild(responsibilityTypeLabel)

                    let responsibilityTypeText = document.createElement('span')
                    responsibilityTypeText.textContent = BAUnits[0]['responsibilities'][responsibility]['type']
                    responsibilityDiv.appendChild(responsibilityTypeText)
                    responsibilityDiv.appendChild(document.createElement('br'))

                    // Responsibility description
                    if (BAUnits[0]['responsibilities'][responsibility]['description']) {
                        let responsibilityDescriptionLabel  = document.createElement('strong')
                        responsibilityDescriptionLabel.textContent = 'Description: '
                        responsibilityDiv.appendChild(responsibilityDescriptionLabel)

                        let responsibilityDescriptionText = document.createElement('span')
                        responsibilityDescriptionText.textContent = BAUnits[0]['responsibilities'][responsibility]['description']
                        responsibilityDiv.appendChild(responsibilityDescriptionText)
                        responsibilityDiv.appendChild(document.createElement('br'))
                    }

                    // Responsibility Party
                    let partyLabel  = document.createElement('strong')
                    partyLabel.textContent = 'Party: '
                    responsibilityDiv.appendChild(partyLabel)

                    let partyText = document.createElement('span')
                    partyText.textContent = BAUnits[0]['responsibilities'][responsibility]['party']['name'] + " (" + BAUnits[0]['responsibilities'][responsibility]['party']['type'] + ")"

                    responsibilityDiv.appendChild(partyText)
                    responsibilityDiv.appendChild(document.createElement('hr'))

                    responsibilitiesDiv.appendChild(responsibilityDiv)
                }
                titleInformationOverlay.appendChild(responsibilitiesDiv)
            }
            // Display overlay
            titleInformationOverlay.style.display = 'block'
        }
    })
})

function toggleLayers(filter) {
    for (let i in floorplanLayers) {
        if (floorplanLayers[i].layer.includes(filter)) {
            let visibility = map.getLayoutProperty(floorplanLayers[i].layer, 'visibility')
            if (visibility == 'visible') {
                map.setLayoutProperty(floorplanLayers[i].layer, 'visibility', 'none')
                this.className = ''
            } else {  
                this.className = 'active'
                map.setLayoutProperty(floorplanLayers[i].layer, 'visibility', 'visible')
            }
        }
    }
}

let filterCheckboxes = document.getElementsByName('filter')
for (let i = 0; i<filterCheckboxes.length; i++) {
    filterCheckboxes[i].addEventListener('change', function(e) {
    let filter = e.target.value
    e.preventDefault()
    e.stopPropagation()
    
    toggleLayers(filter)  
    })
}



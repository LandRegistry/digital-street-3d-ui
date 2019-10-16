
    mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGdpcmRsZXIiLCJhIjoiY2lteW85cm5lMDBmcnY5bTFxY2Zsc3c2OCJ9.VvO2DhAhOVrcjJ0Usw8JIA'
        let map = new mapboxgl.Map({
        style: 'mapbox://styles/mattgirdler/cjznu3ztu06m31clp2j37yybz',
        center: [-3.52841649197765, 50.7242226667005],
        zoom: 16.5,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true
    })

    const buildingHeightSourceLayer = "exeter_buildings_with_height-0ygi87"
    const floorplanLayers = [
        {layer: 'princesshay-level-gf-leasehold', sourceLayer: 'princesshay-level-gf-8yagcd'},
        {layer: 'princesshay-level-gf-freehold', sourceLayer: 'princesshay-level-gf-8yagcd'},
        {layer: 'princesshay-level-1-leasehold', sourceLayer: 'princesshay-level-1-90cnib'},
        {layer: 'princesshay-level-1-freehold', sourceLayer: 'princesshay-level-1-90cnib'}
    ]

    const spatialUnitsDiv = document.getElementById('spatial-units')
    const spatialUnits = JSON.parse(spatialUnitsDiv.innerHTML)

    map.on('load', function() {

        // Create array of building IDs with boundary/floorplan data
        const buildingIdsWithFloorplans = []
        for (let i in floorplanLayers) {
            const features = map.querySourceFeatures('composite', {
                sourceLayer: floorplanLayers[i].sourceLayer,
            })
            for (let j in features) {
                if (!buildingIdsWithFloorplans.includes(features[j].properties.fid)) {
                    buildingIdsWithFloorplans.push(features[j].properties.fid)
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
        // Create a popup, but don't add it to the map yet.
        let popup = new mapboxgl.Popup({
            closeButton: false
        })

        // Display interior floorplans after hiding external geometry
        function displayFloorplan(buildingId) {
            for (let i in floorplanLayers) {
                map.setLayoutProperty(floorplanLayers[i].layer, 'visibility', 'visible')
                const features = map.querySourceFeatures('composite', {
                    sourceLayer: floorplanLayers[i].sourceLayer, 
                    filter: ["==", 'fid', buildingId]
                })
                if (features.length > 0) {
                    const buildingId = features[0].properties.fid
                    const buildingFeature = map.querySourceFeatures('composite', {
                        sourceLayer: buildingHeightSourceLayer,
                        filter: ["==", 'fid', buildingId]
                    })[0]
                    const buildingHeight = buildingFeature.properties.RelHmax
                    const floorHeight = buildingHeight / features[0].properties.num_floors
                    const extrusionHeight = floorHeight * (features[0].properties.floor + 1)
                    const baseHeight = floorHeight*features[0].properties.floor

                    // Add +1 to freehold heights to avoid clipping effect with containing leaseholds 
                    map.setPaintProperty(floorplanLayers[i].layer, 'fill-extrusion-height', (floorplanLayers[i].layer.includes('freehold') ? extrusionHeight+1 : extrusionHeight), {validate: true})
                    map.setPaintProperty(floorplanLayers[i].layer, 'fill-extrusion-base', baseHeight, {validate: true})
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

        function highlightTitle(titleNo) {
            for (let i in floorplanLayers) {
                const features = map.querySourceFeatures('composite', { 
                    sourceLayer: floorplanLayers[i].sourceLayer,
                    filter: ['==', 'title_no', titleNo ] 
                })
                for (let j in features) {
                    map.setFeatureState({id: features[j].id, source: 'composite', sourceLayer: floorplanLayers[i].sourceLayer}, {'highlight': true})
                }
            }
        }

        function disableHighlightTitle() {
            for (let i in floorplanLayers) {
                titleInformationOverlay.style.display = 'none'
                map.removeFeatureState({source: 'composite', sourceLayer: floorplanLayers[i].sourceLayer})
            }
        }

        // Toggle building polygons on/off
        map.on('click', 'exeter-buildings-with-height', function (e) {
            const features = map.queryRenderedFeatures(e.point)
            const feature = features[0]
            if (map.getFeatureState({id: feature.id, source: 'composite', sourceLayer: buildingHeightSourceLayer}).hide) {
                hideFloorplan(feature.properties.fid)
                map.removeFeatureState({id: feature.id, source: 'composite', sourceLayer: buildingHeightSourceLayer}, 'hide')
            } else {
                map.setFeatureState({id: feature.id, source: 'composite', sourceLayer: buildingHeightSourceLayer}, {'hide': true})
                displayFloorplan(feature.properties.fid)
            }
        })

        // Display title information from floorplans
        map.on('mousemove', function(e) {

            disableHighlightTitle()

            // Create array of floorplan style layers for filtering
            const layers = []
            for (let i in floorplanLayers) {
                layers.push(floorplanLayers[i].layer)
            }

            // Check if mouseover is on a floorplan layer
            const features = map.queryRenderedFeatures(e.point, { layers: layers })
            if (features.length > 0) {
                const currentFeature = features[0]

                highlightTitle(currentFeature.properties.title_no)
                
                // New properties code
                let featureId = currentFeature.properties.id

                let spatialUnit = spatialUnits[0].find(function(element) {
                    return element.id == featureId
                })

                let BAUnits = []

                if (spatialUnit) {
                    
                    for (let BAUnit in spatialUnit['ba_units']) {
                        let currentBAUnit = spatialUnit['ba_units'][BAUnit]

                        console.log(currentBAUnit)

                        let title = { 
                            address: spatialUnit.address,
                            titleNumber: currentBAUnit['name'],
                            rights: [],
                            restrictions: [],
                            responsibilities: []
                        }

                        // Rights
                        for (let right in currentBAUnit['rights']) {
                            let currentRight = currentBAUnit['rights'][right]
                            let newRight = {
                            rightId: currentRight['right_id'],
                            type: currentRight['type'],
                            description: currentRight['description'],
                            mortgages: []
                            }

                            if (currentRight['party']) {
                            newRight['party'] = {
                                name: currentRight['party']['name'],
                                type: currentRight['party']['type'],
                                partyId: currentRight['party']
                            }
                            }

                            for (let mortgage in currentRight['mortgages']) {
                            let currentMortgage = currentRight['mortgages'][mortgage]
                            let newMortgage = {
                                type: currentMortgage['type'],
                                amount: currentMortgage['amount'],
                                interestRate: currentMortgage['interest_rate']
                            }
                            newRight['mortgages'].push(newMortgage)
                            } 
                            title['rights'].push(newRight)
                        }

                        // Add restrictions
                        for (let restriction in currentBAUnit['restrictions']) {
                            let currentRestriction = currentBAUnit['restrictions'][restriction]
                            let newRestriction = {
                            type: currentRestriction['type'],
                            description: currentRestriction['description']
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
                            description: currentResponsibility['description']
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
                let titleNumber = document.createElement('strong')
                titleNumber.textContent = BAUnits[0]['titleNumber']
                titleInformationOverlay.appendChild(titleNumber)
                titleInformationOverlay.appendChild(document.createElement('hr'))

                // Rights data
                let rightsDiv = document.createElement('div')
                if (BAUnits[0]['rights'].length > 0) {
                    let rightsLabel = document.createElement('strong')
                    rightsLabel.textContent = 'Rights:'
                    rightsDiv.appendChild(rightsLabel)
                    for (right in BAUnits[0]['rights']) {
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

                        // Right Party
                        let partyLabel  = document.createElement('strong')
                        partyLabel.textContent = 'Party: '
                        rightDiv.appendChild(partyLabel)

                        let partyDiv = document.createElement('div')
                        partyDiv.style = "margin-left: 10px;"

                        //// Party name
                        let partyNameLabel  = document.createElement('strong')
                        partyNameLabel.textContent = 'Name: '
                        partyDiv.appendChild(partyNameLabel)

                        let partyNameText = document.createElement('span')
                        partyNameText.textContent = BAUnits[0]['rights'][right]['party']['name']
                        partyDiv.appendChild(partyNameText)
                        partyDiv.appendChild(document.createElement('br'))

                        //// Party type
                        let partyTypeLabel  = document.createElement('strong')
                        partyTypeLabel.textContent = 'Type: '
                        partyDiv.appendChild(partyTypeLabel)

                        let partyTypeText = document.createElement('span')
                        partyTypeText.textContent = BAUnits[0]['rights'][right]['party']['type']
                        partyDiv.appendChild(partyTypeText)
                        partyDiv.appendChild(document.createElement('br'))

                        rightDiv.appendChild(partyDiv)
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

                        let partyDiv = document.createElement('div')
                        partyDiv.style = "margin-left: 10px;"

                        //// Party name
                        let partyNameLabel  = document.createElement('strong')
                        partyNameLabel.textContent = 'Name: '
                        partyDiv.appendChild(partyNameLabel)

                        let partyNameText = document.createElement('span')
                        partyNameText.textContent = BAUnits[0]['restrictions'][restriction]['party']['name']
                        partyDiv.appendChild(partyNameText)
                        partyDiv.appendChild(document.createElement('br'))

                        //// Party type
                        let partyTypeLabel  = document.createElement('strong')
                        partyTypeLabel.textContent = 'Type: '
                        partyDiv.appendChild(partyTypeLabel)

                        let partyTypeText = document.createElement('span')
                        partyTypeText.textContent = BAUnits[0]['restrictions'][restriction]['party']['type']
                        partyDiv.appendChild(partyTypeText)
                        partyDiv.appendChild(document.createElement('br'))

                        restrictionDiv.appendChild(partyDiv)
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

                        let partyDiv = document.createElement('div')
                        partyDiv.style = "margin-left: 10px;"

                        //// Party name
                        let partyNameLabel  = document.createElement('strong')
                        partyNameLabel.textContent = 'Name: '
                        partyDiv.appendChild(partyNameLabel)

                        let partyNameText = document.createElement('span')
                        partyNameText.textContent = BAUnits[0]['responsibilities'][responsibility]['party']['name']
                        partyDiv.appendChild(partyNameText)
                        partyDiv.appendChild(document.createElement('br'))

                        //// Party type
                        let partyTypeLabel  = document.createElement('strong')
                        partyTypeLabel.textContent = 'Type: '
                        partyDiv.appendChild(partyTypeLabel)

                        let partyTypeText = document.createElement('span')
                        partyTypeText.textContent = BAUnits[0]['responsibilities'][responsibility]['party']['type']
                        partyDiv.appendChild(partyTypeText)
                        partyDiv.appendChild(document.createElement('br'))

                        responsibilityDiv.appendChild(partyDiv)
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

            if (visibility === 'visible') {
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



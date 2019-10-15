
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
                // else {
                    
                // }
    
                // Create HTML for title details 
                titleInformationOverlay.innerHTML = ''

                // Title number
                // let titleNumber = document.createElement('strong')
                // titleNumber.textContent = currentFeature.properties.title_no

                // // Tenure
                // let tenureDiv = document.createElement('div')
                // let tenureLabel = document.createElement('strong')
                // tenureLabel.textContent = 'Tenure: '
                // let tenureText = document.createElement('span')
                // tenureText.textContent = currentFeature.properties.tenure
                // tenureDiv.appendChild(tenureLabel)
                // tenureDiv.appendChild(tenureText)

                // // Address
                // let addressDiv = document.createElement('div')
                // let address = document.createElement('strong')
                // address.textContent = currentFeature.properties.address


                // // Price paid
                // let pricePaidDiv = document.createElement('div')
                // let pricePaidLabel = document.createElement('strong')
                // pricePaidLabel.textContent = 'Price paid: '
                // let pricePaidText = document.createElement('span')
                // pricePaidText.textContent = currentFeature.properties.price_paid
                // pricePaidDiv.appendChild(pricePaidLabel)
                // pricePaidDiv.appendChild(pricePaidText)

                // // Proprietor
                // let proprietorDiv = document.createElement('div')
                // let proprietorLabel = document.createElement('strong')
                // proprietorLabel.textContent = 'Proprietor: '
                // let proprietorText = document.createElement('span')
                // proprietorText.textContent = currentFeature.properties.proprietor
                // proprietorDiv.appendChild(proprietorLabel)
                // proprietorDiv.appendChild(proprietorText)
                
                // titleInformationOverlay.appendChild(tenureDiv)
                // titleInformationOverlay.appendChild(pricePaidDiv)
                // titleInformationOverlay.appendChild(proprietorDiv)
                
                // New code
                // titleInformationOverlay.innerHTML = JSON.stringify(spatialUnit)
                let titleNumber = document.createElement('strong')
                titleNumber.textContent = BAUnits[0]['titleNumber']
                titleInformationOverlay.appendChild(titleNumber)

                let titleData = document.createElement('div')
                titleData.textContent = JSON.stringify(BAUnits[0])

                let rightsDiv = document.createElement('div')
                if (BAUnits[0]['rights']) {
                    let rightsLabel = document.createElement('strong')
                    rightsLabel.textContext = 'Rights:'
                    rightsDiv.appendChild(rightsLabel)
                    for (right in BAUnits[0]['rights']) {
                        let rightTypeLabel  = document.createElement('strong')
                        rightTypeLabel.textContext = 'Type:'
                        rightsDiv.appendChild(rightTypeLabel)

                        let rightTypeText = document.createElement('span')
                        rightTypeText.textContent = BAUnits[0]['rights'][right]['type']
                        rightsDiv.appendChild(rightTypeText)
                    }
                    titleInformationOverlay.appendChild(rightsDiv)
                }

                titleInformationOverlay.appendChild(titleData)
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



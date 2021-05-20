import { useTheme } from '@material-ui/core'
import { useEffect, useState } from 'react'

import { LoadingFiller } from './LoadingFiller'


export function Map(props) {
    const theme = useTheme()
    // setup
    const [mapcontrolCSS, setMapcontrolCSS] = useState(null)
    const [mapcontrolScript, setMapcontrolScript] = useState(null)
    const [mapService, setMapService] = useState(null)
    const routePoints = props.route


    useEffect(() => {
        externalStyleSheet('https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css', setMapcontrolCSS)
        externalScript('https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js', setMapcontrolScript)
        externalScript('https://atlas.microsoft.com/sdk/javascript/service/2/atlas-service.min.js', setMapService)

        return () => {
            if (mapcontrolCSS) { document.body.removeChild(mapcontrolCSS) }
            if (mapcontrolScript) { document.body.removeChild(mapcontrolScript) }
            if (mapService) { document.body.removeChild(mapService) }
        }
    }, [])
    // write to map if it is there
    useEffect(() => {
        if (mapcontrolCSS && mapcontrolScript && mapService) {
            const { atlas } = window
            let map = new atlas.Map('map', {
                authOptions: {
                    authType: 'subscriptionKey',
                    subscriptionKey: 'ool6Hj9lYtwIz82OPwCKdLHWv5EGt7rqkYhT6IFjJDU'
                }, 
                showLogo: false,
                showFeedbackLink: false
            })
            if (routePoints) {
                map.events.add('ready', () => {
                    let datasource = new atlas.source.DataSource()
                    map.sources.add(datasource)
                    map.layers.add(new atlas.layer.LineLayer(datasource, null, {
                        strokeColor: theme.palette.secondary.dark,
                        strokeWidth: 5,
                        lineJoin: 'round',
                        lineCap: 'round'
                    }), 'labels')
                    map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
                        iconOptions: {
                            image: ['get', 'icon'], 
                            allowOverlap: true,
                            opacity: 0.8,
                        },
                        filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]
                    }))
                    let startPoint = new atlas.data.Feature(new atlas.data.Point(routePoints[0]), {
                        icon: 'marker-black'
                    })
                    let endPoint = new atlas.data.Feature(new atlas.data.Point(routePoints[routePoints.length-1]), {
                        icon: 'marker-black'
                    })
                    datasource.add([startPoint, endPoint])
                    map.setCamera({
                        bounds: atlas.data.BoundingBox.fromData([startPoint, endPoint]),
                        padding: 50
                    })
                    datasource.add(new atlas.data.Feature(new atlas.data.LineString(routePoints)))
                })
            }
        }
    })

    return (<div id='map' className={props.className}><LoadingFiller /></div>)
}

function externalScript(url, callback) {
    let scriptElement = document.createElement('script')
    scriptElement.src = url
    scriptElement.crossOrigin = true
    scriptElement.onload = ev => { callback(scriptElement) }
    document.body.appendChild(scriptElement)
}

function externalStyleSheet(url, callback) {
    let sheetElement = document.createElement('link')
    sheetElement.rel = 'stylesheet'
    sheetElement.href = url
    sheetElement.type = 'text/css'
    sheetElement.onload = ev => { callback(sheetElement) }
    document.body.appendChild(sheetElement)
}
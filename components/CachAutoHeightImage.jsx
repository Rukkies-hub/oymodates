import React, { useEffect, useState } from 'react'
import AutoHeightImage from 'react-native-auto-height-image'
import shorthash from 'shorthash'
import * as FileSystem from 'expo-file-system'

const CachAutoHeightImage = (props) => {
  const { url, style, width, resizeMode } = props
  const [uri, setUri] = useState(null)

  useEffect(() => {
    Cached()
  }, [])

  const Cached = async () => {
    const name = shorthash.unique(url)

    const path = `${FileSystem.cacheDirectory}${name}`

    const image = await FileSystem.getInfoAsync(path)

    if (image.exists) {
      setUri(image.uri)
      return
    }

    const newImage = await FileSystem.downloadAsync(uri, path)
    setUri(newImage.uri)
  }

  return <AutoHeightImage style={style} width={width} resizeMode={resizeMode} source={{ uri: url }} />
}

export default CachAutoHeightImage
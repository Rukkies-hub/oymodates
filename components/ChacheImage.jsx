import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import shorthash from 'shorthash'
import * as FileSystem from 'expo-file-system'

const ChacheImage = (props) => {
  const { url, style, resizeMode } = props
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

  return <Image style={style} source={{ uri: url }} resizeMode={resizeMode} />
}

export default ChacheImage
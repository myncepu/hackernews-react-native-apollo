/*
 * url.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import urlParse from 'url-parse'

export function maybeAddProtocol(url, defaultProtocol = 'https') {
  let parsed = urlParse(url)
  if (!parsed.protocol) {
    parsed.set('protocol', defaultProtocol)
    parsed.set('slashes', true)
  }

  return parsed.toString()
}

export function getHostname(url) {
  return urlParse(maybeAddProtocol(url)).hostname || url
}

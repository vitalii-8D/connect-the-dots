import WebFontLoader from 'webfontloader'

// in preload
// const fonts = new WebFontFile(this.load, 'Press Start 2P')
// this.load.addFile(fonts)

export default class WebFontFile extends Phaser.Loader.File
{
  fontNames
  service
  fontsLoadedCount

  /** @param loader {Phaser.Loader.LoaderPlugin}
  @param fontNames {string | string[]}
  @param service {string} */
  constructor(loader , fontNames, service  = 'google')
  {
    super(loader, {
      type: 'webfont',
      key: fontNames.toString()
    })

    this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames]
    this.service = service

    this.fontsLoadedCount = 0
  }

  load()
  {
    const config = {
      fontactive: (familyName) => {
        this.checkLoadedFonts(familyName)
      },
      fontinactive: (familyName) => {
        this.checkLoadedFonts(familyName)
      }
    }

    switch (this.service)
    {
      case 'google':
        config[this.service] = this.getGoogleConfig()
        break

      case 'adobe-edge':
        config['typekit'] = this.getAdobeEdgeConfig()
        break

      default:
        throw new Error('Unsupported font service')
    }


    WebFontLoader.load(config)
  }

  getGoogleConfig()
  {
    return {
      families: this.fontNames
    }
  }

  getAdobeEdgeConfig()
  {
    return {
      id: this.fontNames.join(';'),
      api: '//use.edgefonts.net'
    }
  }

  checkLoadedFonts(familyName)
  {
    if (this.fontNames.indexOf(familyName) < 0)
    {
      return
    }

    ++this.fontsLoadedCount
    if (this.fontsLoadedCount >= this.fontNames.length)
    {
      this.loader.nextFile(this, true)
    }
  }
}

import fs from 'fs'
import satori from 'satori'
import sharp from 'sharp'

export const getOgImage = async (title: string, author: string, date: string, ogTheme: string) => {
  const fontData = (await getFontData()) as ArrayBuffer;
  const bgImage = fs.readFileSync(`./src/ogthemes/${ogTheme}.png`, { encoding: 'base64' })
  const svg = await satori(
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundImage: `url(data:image/png;base64,${bgImage})`,
      padding: '120px',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
        alignSelf: 'center',
      }}>
        <h1 style={{
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          justifyContent: 'center',
          fontSize: '60px',
        }}>{title}</h1>
        <div style={{
          display: 'flex',
          position: 'relative',
          marginTop: '30px',
          marginBottom: '30px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <img src={`https://github.com/${author}.png`} style={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '60px',
          }}/>
          <div style={{
            display: 'flex',
            marginTop: '-10px',
            marginLeft: '75px',
            fontSize: '40px',
          }}>{author} / {date}</div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
  return await sharp(Buffer.from(svg)).png().toBuffer()
}

const getFontData = async () => {
  const API = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@500'
  const css = await (
    await fetch(API, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  ).text()
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  )
  if (!resource) return
  return await fetch(resource[1]).then((res) => res.arrayBuffer())
}

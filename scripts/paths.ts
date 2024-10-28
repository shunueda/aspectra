import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const assets = 'assets'

await mkdir(assets, {
  recursive: true,
})

export const paths = {
  src: 'src',
  readme: 'README.md',
  banner: join(assets, 'banner.svg'),
} as const
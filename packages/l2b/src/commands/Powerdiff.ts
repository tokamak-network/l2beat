import { command, option, positional, string } from 'cmd-ts'
import { Directory } from 'cmd-ts/dist/esm/batteries/fs'
import { powerdiff } from '../implementations/powerdiff'

export const Powerdiff = command({
  name: 'powerdiff',
  description:
    'Compare two directories recursively using difftastic and serve the result',
  version: '1.0.0',
  args: {
    leftPath: positional({ type: Directory, displayName: 'leftPath' }),
    rightPath: positional({ type: Directory, displayName: 'rightPath' }),
    difftasticPath: option({
      type: string,
      long: 'difftastic-path',
      defaultValue: () => 'difft',
    }),
  },
  handler: (args) => {
    powerdiff(args.leftPath, args.rightPath, args.difftasticPath)
  },
})

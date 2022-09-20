import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: './dist/react.js',
    name: 'React',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
}
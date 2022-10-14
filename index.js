const Container = require('./models/container')


const Productos = new Container('productos')



const main = async () => {
  await Productos.save({
    title: "Salsa De Maracuya Frutas Del Sur Con Semillas X 1kg Sin Tacc",
    price: 1169.10,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_877687-MLA41384381722_042020-F.webp"
  })
  // console.log(await Productos.getAll())
  // await Productos.deleteById(3)
  console.log(await Productos.getById(2))
}

main()
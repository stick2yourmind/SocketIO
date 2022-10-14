const fSync = require('fs')
const path = require('path')
const fs = fSync.promises

class Container{
    constructor(archivo) {
      try {
        this.filepath = path.join(process.cwd(), `/db/${archivo}.json`)
        fSync.readFileSync(this.filepath,'utf-8')
        } catch (error) {
          fSync.writeFileSync(this.filepath, '[]')
        }
    }

    async getData(){
      try {
        const data = await fs.readFile(this.filepath,'utf-8')
        const arrayData = JSON.parse(data)
        // Devuelvo el ultimo id utilizado incrementado en 1
        if(arrayData.length)
          return { newId: arrayData.at(-1).id + 1, data: arrayData }
        return { newId: 1, data: arrayData}
      } catch (error) {
        console.log(`Error al leer un archivo: ${error.message}`)
        
      }
    }

    async save(object){
      try {
        const { newId, data } = await this.getData()
        data.push( {...object, id: newId} )
        await fs.writeFile(this.filepath, JSON.stringify(data, null, 2))
        
      } catch (error) {
        console.log(`Error al guardar un objeto: ${error.message}`)
        
      }
    }   

    async getById(number) {
      try {
        const { data } = await this.getData()
        const foundData = data.find( element => element.id === number )
        if(!foundData)
          throw new Error('Elemento no encontrado')
        return foundData
      } catch (error) {
        console.log(`Error al obtener un objeto por su id: ${error.message}`)
      }
    }

    async getAll() {
      try {
        const { data } = await this.getData()
        return data
      } catch (error) {
        console.log(`Error al obtener todos los objetos: ${error.message}`)
      }
    }

    async deleteById(number) {
      try {

        const { data } = await this.getData()
        const indexFound = data.findIndex( element => element.id === number)
        // Caso no existe objeto con el id indicado
        if( indexFound === -1)
          throw new Error('Elemento no encontrado')
        // Elimino el elemento indicado
        data.splice(indexFound, 1)
        await fs.writeFile(this.filepath, JSON.stringify(data))

      } catch (error) {
        console.log(`Error al eliminar un objeto: ${error.message}`)
      }
    }

    async deleteAll(){
      try {
        await fs.writeFile(this.filepath, '[]')
      } catch (error) {
        console.log(`Error al eliminar todos los objetos: ${error.message}`)
      }
    }
}

module.exports = Container
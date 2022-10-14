const fSync = require('fs')
const path = require('path')
const fs = fSync.promises

class Container{
    constructor(archivo) {
      try {
        this.filepath = path.join(process.cwd(), `/db/${archivo}.json`)
        fSync.writeFileSync(this.filepath, '[]')
        } catch (error) {
          console.log(`Error en el constructor: ${error.message}`)
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

    async save(payload){
      try {
        const { newId, data } = await this.getData()
        data.push( {...payload, id: newId} )
        await fs.writeFile(this.filepath, JSON.stringify(data, null, 2))
        
      } catch (error) {
        console.log(`Error al guardar un objeto: ${error.message}`)
        
      }
    }
    
    async updateById(payload, id) {
      try {
        const { data } = await this.getData()
        const indexFound = data.findIndex( element => element.id === Number(id))
        // Caso no existe objeto con el id indicado
        if( indexFound === -1)
          throw new Error('Elemento no encontrado')
        // Reemplazo el elemento indicado
        data.splice(indexFound, 1, {...payload, id})
        await fs.writeFile(this.filepath, JSON.stringify(data, null, 2))

      } catch (error) {
        console.log(`Error al eliminar un objeto: ${error.message}`)
      }
    }

    async getById(id) {
      try {
        const { data } = await this.getData()
        const foundData = data.find( element => element.id === Number(id) )
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

    async deleteById(id) {
      try {

        const { data } = await this.getData()
        const indexFound = data.findIndex( element => Number(element.id) === Number(id))
        // Caso no existe objeto con el id indicado
        if( indexFound === -1)
          throw new Error('Elemento no encontrado')
        // Elimino el elemento indicado
        data.splice(indexFound, 1)
        await fs.writeFile(this.filepath, JSON.stringify(data, null, 2))

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
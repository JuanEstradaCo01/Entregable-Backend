const UsersService = require("../services/usersService")

class UsersController {
    constructor() {
        this.service = new UsersService()
    }

    async getUsers(req, res){
        try{
            const users = await this.service.getUsers()
            return res.status(200).json(users)
        }catch(e){
            req.logger.error("Ha ocurrido un error al buscar los usuarios")
            return res.status(500).json({Error: "Ha ocurrido un error al buscar los usuarios"})
        }
    }

    async getUserById(req, res){
        const uid = req.params.uid
        const role = req.params.role
        try{
            const user = await this.service.getUserById(uid)
            if(!user){
                req.logger.warning("No se encontro el usuario")
                return res.status(404).json({error: "No se encontro el usuario"})
            }
            user.typeCount = role
            user.provider = "Local"
            const cartId = user.cart
    
            return res.render("profileParams", {user, cartId}) 
            //res.status(200).json(user)
        }catch(e){
            req.logger.error(`Ha ocurrido un error al buscar el usuario con el ID: ${uid}`)
            return res.status(500).json({Error: `Ha ocurrido un error al buscar el usuario con el ID: ${uid}`})
        }
    }

    async updateUser(req, res){
        try{
            const body = req.body
            const uid = req.params.uid
            await this.service.updateUser(uid, body)
            req.logger.info("¡Usuario modificado exitosamente!")
            return res.status(200).json(body)
        }catch(e){
            req.logger.error("Ha ocurrido un erro al modificar el usuario")
            return res.status(500).json({error: "Ha ocurrido un erro al modificar el usuario"})
        }
    }

    async uploadDocuments(req, res){
        const uid = req.params.uid
        const body = req.body
        console.log({body})
        try{
            const user = await this.service.getUserById(uid)

            if(!user){
                req.logger.error(`No se ha encontrado el usuario con el ID:${uid}`)
                return res.status(404).json({Error: `No se ha encontrado el usuario con el ID:${uid}`})
            }
            
            const upload = await this.service.uploadDocuments(user._id, body)

            if(!upload){
                req.logger.error("Ocurrio un error al subir el documento")
            }

            req.logger.info("¡Documento subido exitosamente!")
            
            return res.status(200).json({ok: "¡Documento subido exitosamente!"})
            
        }catch(e){
            req.logger.fatal("Ha ocurrido un error al cargar el documento")
            return res.status(500).json({Error: "Ha ocurrido un error al cargar el documento", e})
        }
    }
}

module.exports = UsersController
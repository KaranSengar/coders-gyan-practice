import bcrypt from 'bcryptjs'


export class CredetialsService{

    async comparePassword(userPassword:string,passwordHash:string){
        const compare = await bcrypt.compare(userPassword,passwordHash)
        return compare
    }

}
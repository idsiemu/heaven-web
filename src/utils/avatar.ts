import { ISession } from "@redux/features/session/slice"

const generateAvatar = (session : ISession | null) => {
    if(session){
        if(session.image.length > 0) {
            return session.image[0].ss_size ? (session.image[0].domain + session.image[0].ss_size) : (session.image[0].domain + session.image[0].origin)
        }
        return '/public/icons/default-avatar.png'
    }
    return '/public/icons/default-avatar.png'
}

export default generateAvatar
export default (req: any, res: any, next: any) => {
    const sessionToken = req.session.token
    const userId = req.session.userId
    if (!sessionToken && !userId) {
        return res.status(401).send({data:'Unauthorized.'})
    }
    req.body.whoSentTheRequest = userId
    next()
}

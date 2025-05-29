/** 
 * @param req {import("express").Request} 
 * @param res {import("express").Response}
 * @param next {import("express").NextFunction}
 */
export default function logginMiddleware(req, res, next) {
    const requestID = crypto.randomUUID();
    const startTime = performance.now();
    res.locals.requestID = requestID;
    console.log(req.method, req.path, { requestID })
    res.on("finish", () => {
        console.log(`[${res.statusCode}] ${res.statusMessage}`, req.method, req.path, `took ${Math.round(performance.now() - startTime)}ms`, { requestID })
    })
    next()
}
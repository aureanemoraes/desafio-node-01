const ReqToJson = async (req, res) => {
    res.setHeader('Content-type', 'application/json');

    let buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    req.body = buffers.length > 0 ? JSON.parse(String(Buffer.concat(buffers))) : null;
}

export default ReqToJson;
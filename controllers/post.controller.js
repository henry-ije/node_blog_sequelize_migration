const models = require("../models")

const Validator = require("fastest-validator")

function save(req, res){

    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId:1
    }

    const schema = {
        title: {type:"string", optional: false, max: "100"},
        content: {type:"string", optional:false, max:"500"},
        categoryId: {type: "number", optional:false}
    }

    const v = new Validator()
    
    const validationResponse = v.validate(post, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        })

    }

    models.Category.findByPk(req.body.categoryId)
    .then(result => {
        if(result !== null){
            models.Post.create(post)
            .then(result=>{
                res.status(201).json({
                    message: "Post created successfully",
                    post: result
                })
            })
            .catch(error => {
                res.status(500).json({
                    message: "Something went wrong",
                    error: error
                })
            });
        }else {
            res.status(400).json({
                message: "Invalid Category ID",
                error: error
            })

        }
    })
}

function show (req, res) {
    const id = req.params.id;
    models.Post.findByPk(id)
    .then(result => {
        if (result){
            res.status(200).json(result)

        }else {
            res.status(404).json({
            message: "Post not found!"
            })

        }

    })
    .catch(error => {
        res.status(500).json({
            message:"Something went wrong"
        })

    })
}

function index (req, res) {
    models.Post.findAll()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json({
            message:"Something went wrong"
        })

    })

}

function update (req, res) {
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
    }
    const userId = 1;

    const schema = {
        title: {type:"string", optional: false, max: "100"},
        content: {type:"string", optional:false, max:"500"},
        categoryId: {type: "number", optional:false}
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedPost, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        })

    }

    models.Category.findByPk(req.body.categoryId)
    .then(result => {
        if(result !== null){
            models.Post.update(updatedPost, {where: {id:id, userId:userId}})
    .then(result => {
        res.status(200).json({
            message:"Post updated",
            post:updatedPost
        });
    })
    .catch(error => {
        res.status(500).json({
            message:"Something went wrong",
            error:error
        })
    })

        }
    })

    
}

function destroy(req, res){
    const id = req.params.id;
   userId = 1;
   models.Post.destroy({where:{id:id, userId:userId}})
   .then(result => {
    res.status(200).json({
        message:"Post successully deleted",
    });
})
.catch(error => {
    res.status(500).json({
        message:"Something went wrong",
        error:error
    })
})
}

module.exports = {
    save:save,
    show:show,
    index:index,
    update:update,
    destroy:destroy
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt_secret = void 0;
// ugly way to ignore typescript errors it just ignore the next line error @ts-ignore
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
exports.jwt_secret = "mysecret";
mongoose_1.default.connect("mongodb+srv://hg60543:Harsh%40124@cluster0.dqd1atc.mongodb.net/second_brain");
app.use(express_1.default.json());
app.post("/api/v1/signup", async (req, res) => {
    //zod validation  -> not implemented yet
    const { username, password } = req.body;
    const existtingUser = await db_1.UserModel.findOne({ username });
    if (existtingUser) {
        return res.status(400).json({
            message: "User already exiits"
        });
    }
    const user = await db_1.UserModel.create({ username, password });
    return res.status(201).json({
        message: "user created successfully"
    });
});
app.post("/api/v1/signin", async (req, res) => {
    //zod validation  -> not implemented yet
    const { username, password } = req.body;
    const response = await db_1.UserModel.findOne({ username, password });
    if (!response) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: response._id,
    }, exports.jwt_secret);
    return res.status(200).json({
        message: "User signed in successfully",
        token: token
    });
});
app.post("/api/v1/content", middleware_1.auth, async (req, res) => {
    const { title, link, tags } = req.body;
    if (!title || !link) {
        return res.status(400).json({
            message: "title, link and userId are required"
        });
    }
    const content = await db_1.UserContent.create({
        title: title,
        link: link,
        tags: tags || [],
        // @ts-ignore
        userId: req.userId
    });
    return res.status(201).json({
        message: "Content added successfully",
    });
});
app.get("/api/v1/content", middleware_1.auth, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    // ..........................................................................................................................................
    // const response = await UserContent.find({userId}).lean();
    // if(!response)
    // {
    //     return res.json({
    //         message: "No conten found",
    //     })
    // }
    // const user = await UserModel.findById(userId).lean();
    // if(!user)
    // {
    //     return res.status(404).json({
    //         message: "User not found"
    //     })
    // }   
    // const content = response.map(c => ({
    //     user: user.username,
    //     itle: c.title,
    //     link: c.link,
    //     tags: c.tags,
    //     // _id: c._id.toString()
    // }));
    //.............................................................................................................................................
    const content = await db_1.UserContent.find({ userId: userId }).populate("userId", "username");
    return res.status(200).json({
        message: "Content fetched successfully",
        content: content
    });
});
app.delete("/api/v1/content", middleware_1.auth, async (req, res) => {
    const contentId = req.body.contentId;
    if (!contentId) {
        return res.status(400).json({
            message: "contentId is required"
        });
    }
    await db_1.UserContent.deleteMany({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    });
    return res.json({
        message: "Content deleted successfully"
    });
});
app.post("/api/v1/library/share", (req, res) => {
    const { shareLink } = req.body;
    if (!shareLink) {
        return res.status(400).json({
            message: "shareLink is required"
        });
    }
    // Logic to share the link, e.g., save it to the database or send it via email
    return res.status(200).json({
        message: "Share link created successfully",
        shareLink: shareLink
    });
});
app.get("/api/v1/library/:shareLink", (req, res) => {
});
app.listen(3000);
//# sourceMappingURL=index.js.map
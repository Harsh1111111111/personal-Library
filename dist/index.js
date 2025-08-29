"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ugly way to ignore typescript errors it just ignore the next line error @ts-ignore
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const dburl = process.env.MONGO_URL;
if (!dburl) {
    console.error("Mongo url is not define in the .env file");
    process.exit(1);
}
mongoose_1.default.connect(dburl);
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
app.get("/api/secret/getuserdetails", middleware_1.adminauth, async (req, res) => {
    const users = await db_1.UserModel.find({});
    return res.json(users);
});
app.post("/api/v1/signin", middleware_1.auth, async (req, res) => {
    //zod validation  -> not implemented yet
    const { username, password } = req.body;
    const response = await db_1.UserModel.findOne({ username, password });
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        return res.json({
            message: "Jwt_secret is not present so token cannot be made"
        });
    }
    if (!response) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: response._id,
    }, jwt_secret);
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
app.post("/api/v1/library/share", middleware_1.auth, async (req, res) => {
    const share = req.body;
    // @ts-ignore
    const user = req.userId;
    const existinglink = await db_1.LinkModel.findOne({ userId: user });
    if (existinglink) {
        return res.json({
            message: "Link already exists",
            link: existinglink.hash
        });
    }
    if (share) {
        const hash = (0, utils_1.random)(10);
        const link = await db_1.LinkModel.create({
            hash: '/share/' + hash,
            //@ts-ignore
            userId: req.userId
        });
        return res.status(201).json({
            message: "Link created successfully",
            link: hash
        });
    }
    await db_1.LinkModel.deleteOne({
        //@ts-ignore
        userId: req.userId
    });
    return res.status(200).json({
        message: "Link deleted successfully"
    });
});
app.get("/api/v1/library/share/:shareLink", middleware_1.auth, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const link = await db_1.LinkModel.findOne({
        userId: userId
    });
    if (!link) {
        return res.status(404).json({
            message: "Link not found"
        });
    }
    const content = await db_1.UserContent.find({ userId: link.userId });
    const user = await db_1.UserModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }
    res.json({
        username: user.username,
        content
    }); // Send user and content details in response.
});
app.listen(3000);
//# sourceMappingURL=index.js.map
const app = require("../index"); 
const supertest = require("supertest");
require("../middleware/auth") // Signup and login authentication middleware
const request = require("supertest");
require("dotenv").config();
const {readingTime} = require("../routes/readTime")
const userModel = require(".././models/users")
const articleModel = require("../models/articles")
const bcrypt = require ("bcrypt");



let authorization_string = null;
let article_id = null;
const initializeBloggrDB = async () => {
  const saltRounds = 10;
  const hashed_password = await bcrypt.hash("newPassword", saltRounds);
  const user = new userModel({
    firstName: "Silver",
    lastName: "Okonkwo",
    username: "silico",
    bio: "Cool Cat",
    gender: "female",
    email: "silvy@gmail.com",
    password: hashed_password,
  });
  await user.save();

  const loginUser = {
    email: "silvy@gmail.com",
    password: "newPassword",
  };
  const loggInresponse = await request(app)
    .post("/login")
    .send(loginUser);
  const token = loggInresponse.body.token;
  authorization_string = "Bearer " + token;
  // Create one dummy article
  let article = {
    title: "My title is correct, yes it is!",
    body: "There was once a story of an little child s sfsf sf rserw f ewf we ew. He was the strongest across all the lands. His name was the incredible hulk. He was a green little fellow with the muscles of a lion and the smarts of a Hyena. He loved to write and sing, but all of that didn't matter because everyone that met him was repelled by his unique looks iewoii i ie iw i i ai i wei wri iwe fiw eif wei fiwe iwe i wei wei weci wei ier bie bi eig ei biwe fir iw irw gier wvire gir i eire ier bire bie i wkl efkwe flewfklew flkwe flkwe fklwe fkwe flwek flwe fklwef klwe flkwe flkwe flkwe fwkle fklwe fklwe fklwe flkew fkelw fklwe fklwe fkewl flwke flkwe flwek fwkel flewk flkwe fklwe flwer ge ier gegeroy gsxa qot",
    description:
      "A quick story about the life of the incredible hulk lker flke rflkr lk etlk ytlkr klerg erl gklrt hkl vdfkl vk bklerv eklr vkerl vkre gtkr hlk tkl fvlkwr fkelr klv erlk gkle rgkler glekr g",
    tags: ["drama", "coding", "Netflix"]
  };
  const response = await supertest(app)
    .post("/blogs")
    .send(article)
    .set("Authorization", authorization_string);

  article_id = request.user;
  const publishResponse = await supertest(app)
    .post("/blogs/")
    .set("Authorization", authorization_string);
  console.log(publishResponse.body);
};

const clearBloggerDb = async () => {
  await userModel.deleteMany({});
  await articleModel.deleteMany({});
};

beforeAll(async () => {
  await initializeBloggrDB();
});

describe("POST /signup", () => {
  it("Check for valid Input", async () => {
    const faultyData = {
      firstName: "S",
      lastName: "Okonkwo",
      username: "diko",
      bio: "Cool Cat",
      gender: "female",
      email: "silvy@gmail.com",
      password: "newPassword",
    };

    const response_1 = await supertest(app)
      .post("/signup")
      .send(faultyData);
      expect(response_1.status).toBe(500);
  });

  it("If Valid, User should be signed up", async () => {
    const newUser = {
      firstName: "Obi",
      lastName: "Okonkwo",
      username: "fatia",
      bio: "Cool Cat",
      gender: "female",
      email: "ovi@gmail.com",
      password: "newPassword",
      };
    const response_2 = await supertest(app).post("/signup").send(newUser);
    expect(response_2.status).toBe(200);
  });
});

describe("POST /login", () => {
  it("Authenticate user", async () => {
    const user = {
      email: "silvy@gmail.com",
    password: "newPassword",
    };
    const response = await supertest(app).post("/login").send(user);
    expect(response.status).toBe(200);
  });

  it(" Should not authenticate unregistered user", async () => {
    const user = {
      email: "mfonumoh@gmail.com",
      password: "passwordisWrong",
    };
    const response = await supertest(app).post("/login").send(user);
    expect(response.status).toBe(500);
  });

  it("user with incorrect email should not be authenticated", async () => {
    const user = {
      email: "idogho@gmail.co",
      password: "wrongPassword",
    };
    const response = await supertest(app).post("/user/login").send(user);
    expect(response.status).toBe(404);
  });


describe("POST /blogs", () => {
  it("Unauthenticated user cannot create a blog", async () => {
    const response = await supertest(app).post("/blogs");
    expect(response.status).toBe(401);
  });

  it("create blog if valid user", async () => {
    let article = {
      title: "lagv dysfg",
      description: "the express third bridge went lorem ipsum lorem ipsum lorem ipsum",
      body: "who cares to know what had happened between them that led to the brifge fallig aprt int the middle of nowhere he had to go get a job and be the best in what he doesbnt know anything ablout  and aldo be the guide that they always weanted and also be the first ione",
      tags: ["food", "ikon"],
    };
    const user = {
      email: "silvy@gmail.com",
      password: "newPassword",
      };
    const loggInresponse = await supertest(app).post("/login").send(user);
    const token = loggInresponse.body.token;
    const authorization_string = "Bearer " + token;
    const response = await supertest(app)
      .post("/blogs")
      .send(article)
      .set("Authorization", authorization_string);
      expect(response.status).toBe(400);
    });
  })

  it("Check for invalid request", async () => {
    let article = {
      title: "ikon",
      description: "here'sjhdbkhsjdfshdgmy new blog",
      body: "this is goi dvgshvdhbsng to be a very short post and i am just going to check for valid user so that they can create a post and my  test can pass",
      tags: ["new", "Obong"]
    };

    const response = await supertest(app)
      .post("/blogs")
      .send(article)
      .set("Authorization", authorization_string);
      expect(response.status).toBe(400);
    });
  });
       

describe("PATCH /blogs/update/:id", () => {
  it("authenticated users cannot update blog to published", async () => {
    const article = await articleModel.findOneAndUpdate({ title: "ikon" });
    const response = await supertest(app).patch(
      "/blogs/update/:id"
    );
    expect(response.status).toBe(401);
  });

  it("Should not allow user to publish if he isn't logged in and the author", async () => {
    const article = await articleModel.findOneAndUpdate({ title: "ikon" });
    const response = await supertest(app)
      .patch("/blogs/update/:id")
      .set("Authorization", authorization_string);
        expect(response.status).toBe(200);
    });
  });

describe("GET /blog/:id", () => {
  it("Should get an article successfully if it is published", async () => {
    const response = await supertest(app).get("/blogs/:id}");
    expect(response.status).toBe(200);
  });
});


// describe("PUT /article/:id", () => {
//   it("Should successfully edit an article", async () => {
//     let article = {
//       title: "My title is correct, init",
//       body: "There was once a story of an little child s sfsf sf rserw f ewf we ew. He was the strongest across all the lands. His name was the incredible hulk. He was a green little fellow with the muscles of a lion and the smarts of a Hyena. He loved to write and sing, but all of that didn't matter because everyone that met him was repelled by his unique looks iewoii i ie iw i i ai i wei wri iwe fiw eif wei fiwe iwe i wei wei weci wei ier bie bi eig ei biwe fir iw irw gier wvire gir i eire ier bire bie i wkl efkwe flewfklew flkwe flkwe fklwe fkwe flwek flwe fklwef klwe flkwe flkwe flkwe fwkle fklwe fklwe fklwe flkew fkelw fklwe fklwe fkewl flwke flkwe flwek fwkel flewk flkwe fklwe flwer ge ier gegeroy gsxa qot",
//       description:
//         "A quick story about the life of the incredible hulk lker flke rflkr lk etlk ytlkr klerg erl gklrt hkl vdfkl vk bklerv eklr vkerl vkre gtkr hlk tkl fvlkwr fkelr klv erlk gkle rgkler glekr g",
//       tags: ["drama", "coding", "Netflix"],
//     };
//     const response = await supertest(app)
//       .put(`/article/${article_id}`)
//       .send(article)
//       .set("Authorization", authorization_string);
//     expect(response.status).toBe(200);
//   });
// });

describe("GET /blogs/user/articles", () => {
  it("Should get all blogs by current user", async () => {
    const response = await supertest(app)
      .get("/blogs/user/articles")
      .set("Authorization", authorization_string);
    console.log(response.body.length, response.body);
    expect(response.status).toBe(200);
  });
});

describe("GET /blogs/published", () => {
  it("Get published blogs", async () => {
    const response = await supertest(app)
      .get("/blogs/published/")
      .set("Authorization", authorization_string);
      expect(response.status).toBe(200);
    });
  })

afterAll(async () => {
  await clearBloggerDb();
});



import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client(
  {
    user: "postgres",
    host: "localhost",
    database: "library",
    password: "xxxxxx",
    port: 5432
  }
)

db.connect();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

let books = [];

app.get("/", async (req, res) => {
  var sort =  req.query.by;
  // console.log(id);
  var direction = req.query.dir;
  var result;

  try{
    if(sort === undefined || direction === undefined ){
  result = await db.query("SELECT * FROM books ORDER BY created_on DESC;");
  sort = "Date";
  direction = "DESC"
    }
    else if(sort === 'Date'){
      result = await db.query("SELECT * FROM books ORDER BY created_on "+ direction + ";");
    }
    else if(sort === 'Name'){
      result = await db.query("SELECT * FROM books ORDER BY name "+ direction + ";");
    }
    else if(sort === 'Ratings'){
      result = await db.query("SELECT * FROM books ORDER BY rating "+ direction + ";");
    }
  books = result.rows;
  books.forEach(book=>{
    book.created_on = book.created_on.toLocaleDateString();
    if(book.note.length>100 ){
      let t = book.note.slice(0,100);
      t = t + '....';
      book.note = t;
      t = '';
    }
  })
  // console.log(items);
  res.render("index.ejs", {
    books: books,
    sort: sort,
    direction: direction
  });
}
catch(err){
  console.log(err);
}
});

app.get("/create",(req,res)=>{
  res.render("note.ejs");
})

app.get("/view/:id", async (req,res)=>{
  const id = req.params.id;
  var book;
  const result = await db.query("SELECT * FROM books WHERE id = $1",[id]);
  book = result.rows[0];
    book.created_on = book.created_on.toLocaleDateString();
  res.render("review.ejs",{
    book: book
  });
})

app.post("/createnote", (req, res) => {
  const book = req.body;
  let d = new Date();

  try{
   db.query("INSERT INTO books (name, authors, cover_i, rating, note, created_on) VALUES ($1, $2, $3, $4, $5, $6)"
  ,[book['book_title'], book['book_authors'], book['cover'], book['rating'], book['notes'], d.toUTCString() ]);
  // console.log(book);
  res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/editnote/:id", (req, res) => {
  const id = req.params.id;
  const book = req.body;
  let d = new Date();
  try{
  const result = db.query("UPDATE books SET note = $1, rating = $2, created_on = $3 WHERE id = $4"
  ,[book.notes, book.rating, d.toUTCString(), id]);
  res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  try{
  const result = db.query("DELETE FROM books WHERE id = $1",[id]);
  // console.log(id);
  res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express') //express를 설치했기 때문에 가져올 수 있다.
const app = express();
const getConnection = require('./db');
const path = require('path'); //path를 import한다
const passport = require('passport'),LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const flash = require('connect-flash');


// app.set('view engine', 'ejs'); //'ejs'탬플릿을 엔진으로 한다.
// app.engine('html', require('ejs').renderFile);
app.set('views', './views'); //폴더, 폴더경로 지정
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(expressSession({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
console.log('123')


// app.use(bodyParser.urlencoded({ extended: false }));
//node 에서 html에 외부 js 입힐경우 필수
app.use('/script', express.static(__dirname + "/static/js"));






//리스트 표시
app.get('/', (req, res) => {
    // When done with the connection, release it.
    res.sendFile(__dirname+"/static/templates/list.html")
})
app.post('/', (req, res) => {
    getConnection((conn) => {
        conn.query('SELECT title,writer,boardNo,regDate FROM board', function (error, results, fields) {
            // When done with the connection, release it.
            conn.release();
            console.log(results)
            let sesion;
            if(req.session.user){
                sesion = req.session.user;
                console.log(req.session.user);
            }
            res.json({
                user : sesion,
                articles : results
            })
            // res.render("list",{
            //     title : "목록",
            //     results : results
            // })
            if (error) throw error;

        });
    })
})
//
// app.get('/', (req, res) => {
//     getConnection((conn) => {
//         conn.query('SELECT title,writer,boardNo FROM board', function (error, results, fields) {
//             // When done with the connection, release it.
//             conn.release();
//             console.log(results)
//             res.json("list",{
//                 title : "목록",
//                 results : results
//             })
//             // res.render("list",{
//             //     title : "목록",
//             //     results : results
//             // })
//             if (error) throw error;
//
//         });
//     })
// })

//조회 html 이동
app.get('/view', (req, res) => {

    if(!req.session){
        res.redirect('/');
    }

    res.sendFile(__dirname+"/static/templates/view.html");
});
app.post('/view', (req, res) => {
    let param = req.body;

    console.log(param)
    getConnection((conn) => {
        conn.query('SELECT title,writer,boardNo,content,regDate FROM board where boardNo = ?',[param.boardNo], function (error, results, fields) {
            // When done with the connection, release it.
            conn.release();
            console.log(results)

            res.json({articles : results})
            if (error) throw error;

        });
    })
})

//등록 html 이동
app.get('/add', (req, res) => {
    if(!req.session.passport){
        res.redirect('/');
        return ;
    }
    res.sendFile(__dirname+"/static/templates/add.html");
})
//등록 처리 로직
app.post('/add', (req, res) => {
    let titleReq= req.body.title;
    let writerReq= req.body.writer;
    let contentReq= req.body.content;

    getConnection((conn) => {
        conn.query('INSERT INTO board (title,writer,content) VALUE(?,?,?)', [titleReq,writerReq,contentReq] , function (error, results, fields) {
            // When done with the connection, release it.
            conn.release();
            console.log(results)

            if(results != null){

                res.json({code:"success"})
            }

            if (error) throw error;

        })
    })

})

app.post('/modify', (req, res) => {
    let param = req.body;

    let paramTitle = param.title;
    let paramWriter = param.writer;
    let paramContent = param.content;
    let paramBoardNo = param.boardNo;

    console.log(param)
    getConnection((conn) => {
        conn.query('UPDATE board SET title = ?,writer = ? , content = ? where boardNo = ?',
            [paramTitle,paramWriter,paramContent,paramBoardNo], function (error, results, fields) {
            // When done with the connection, release it.
            conn.release();
            console.log(results)
            if(results != null){

                res.json({code:"success"})
            }

            if (error) throw error;

        });
    })
})

app.post('/del', (req, res) => {
    let param = req.body;

    let paramBoardNo = param.boardNo;

    console.log(param)
    getConnection((conn) => {
        conn.query('delete from board where boardNo = ?',[paramBoardNo], function (error, results, fields) {
                // When done with the connection, release it.
                conn.release();
                console.log(results)
                if(results != null){

                    res.json({code:"success"})
                }

                if (error) throw error;

            });
    })
})
app.get('/login', async (req, res) => {

    try {
        res.sendFile(path.resolve("static/templates/login.html"));
    } catch (err) {
        throw Error(err);
    }
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/loginSuccess',
    failureRedirect : '/loginFail',
    failureFlash : true
}))

app.get('/loginSuccess', (req, res) => {
    res.sendFile(path.resolve("static/templates/loginSuccess.html"));
})
app.get('/loginFail', (req, res) => {
    console.log(req.body);
    res.sendFile(path.resolve("static/templates/loginFail.html"));
})


passport.use('local-login', new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'userPw',
    passReqToCallback: true
}, (req, userId, userPw, done) => {
    console.log('passport의 local-login : ', userId, userPw)


    if(userId != 'test' || userPw != '12345') {
        console.log('비밀번호 불일치!')
        return done(null, false, req.flash('loginMessage', '비밀번호 불일치!'))
    }

    console.log('비밀번호 일치!')
    return done(null, {
        userId : userId,
        password: userPw
    })
}))

passport.serializeUser(function(user, done) {
    console.log('serializeUser() 호출됨.');
    console.log(user);

    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserializeUser() 호출됨.');
    console.log(user);

    done(null, user);
})

app.get('/delSession', (req, res) => {
    if(req.session){
        req.session.destroy(()=>{
            res.redirect('/');
        });
    }
})


app.listen(8080);
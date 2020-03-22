
Hacker News is a tech news aggregator founded by Paul Graham, the man behind Y Combinator. It is one of the best sources online for intellectually stimulating news, and its content is not just limited to software technology. In this project, you'll play mad scientist and make a functioning clone of Hacker News. MWA HA HA HA! IT'S ALIVE! 

Docs: http://curric.rithmschool.com/springboard/exercises/hack-or-snooze-ajax-api/

Demo: http://hack-or-snooze.surge.sh/

#1. Get request to an array of stories: GET request to /stories

https://hack-or-snooze-v3.herokuapp.com/stories

#2. signup to get a token: POST request to /signup

https://hack-or-snooze-v3.herokuapp.com/signup

```json
{"user":{"name":"Test User","username":"test","password":"foo"}}
```
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjNyciIsImlhdCI6MTU4Mzc5MzQwNH0.wZqZ9WHk_oMvdX9W-qtCMWS4rSuonWqBc5MPBnans3s",
    "user": {
        "createdAt": "2020-03-09T22:36:44.234Z",
        "favorites": [],
        "name": "Test User123rr",
        "stories": [],
        "updatedAt": "2020-03-09T22:36:44.234Z",
        "username": "test123rr"
    }
}
```
#3. Create new story: POST request to /stories
https://hack-or-snooze-v3.herokuapp.com/stories

```json
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjNyciIsImlhdCI6MTU4Mzc5MzQwNH0.wZqZ9WHk_oMvdX9W-qtCMWS4rSuonWqBc5MPBnans3s", "story": {"author":"Elie Schoppik","title":"Four Tips for Moving Faster as a Developer", "url": "https://www.rithmschool.com/blog/developer-productivity"} }
```

```json
{"user":{"name":"roroworld","username":"roroworld","password":"1234qwer"}}
,
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvcm93b3JsZCIsImlhdCI6MTU4Mzg4MDQwOH0.xg96xAm88KMtwyV5WFzqv-fvPJ2GBpNb06kdwbBQ2kM",
    "user": {
        "createdAt": "2020-03-10T22:46:48.882Z",
        "favorites": [],
        "name": "roroworld",
        "stories": [],
        "updatedAt": "2020-03-10T22:46:48.882Z",
        "username": "roroworld"
    }
}
```
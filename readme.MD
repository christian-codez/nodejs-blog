---
# Welcome to Nodjs Blog API 8-)
::: warning
### Users API Endpoints
:::

- `GET: /api/users/`
- `GET: /api/users/:userid`
- `POST: /api/users/`
This endpoint requires you to send a request with a token(named "authorization")

##### PARAMS

    STRING: name (required)
    STRING: email (required)
    STRING: password (required)
    STRING: gender
    STRING: country
    STRING: age
    STRING: bio
    ARRAY: stacks

- `PATCH: /api/users/me`
This endpoint requires you to send a request with a token(named "authorization")
##### PARAMS

    STRING: name  
    STRING: email  
    STRING: password  
    STRING: gender
    STRING: country
    STRING: age
    STRING: bio
    ARRAY: stacks

- `DELETE: /api/users/me`
This endpoint requires you to send a request with a token(named "authorization")

::: warning 
### Posts API Endpoints
:::  
- `GET: /api/posts/`
- `GET: /api/posts/:userid`
- `GET: /api/posts/search?s=keyword`
- `POST: /api/posts/`
This endpoint requires you to send a request with a token(named "authorization")

##### PARAMS

    STRING: title (required)
    STRING: content (required)

- `PATCH: /api/posts/:id`
This endpoint requires you to send a request with a token(named "authorization")
##### PARAMS

    STRING: title
    STRING: content

- `DELETE: /api/posts/:id`
This endpoint requires you to send a request with a token(named "authorization")


::: warning
### Comments API Endpoints
:::  
- `GET: /api/comments/:post_id`
- `POST: /api/comments/:post_id` This endpoint requires you to send a request with a token(named "authorization")

##### PARAMS

    STRING: comment (required)

- `PATCH: /api/comments/:post_id/:comment_id`
This endpoint requires you to send a request with a token(named "authorization")
##### PARAMS

    STRING: comment (required)

- `DELETE: /api/comments/:post_id/:comment_id`
This endpoint requires you to send a request with a token(named "authorization")



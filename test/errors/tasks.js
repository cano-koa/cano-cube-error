module.exports = {
  HireError: taskHireError,
  UserError: taskUserError
}

function taskHireError({ body, params, query }) {
  console.error(`HireError
    Body ${JSON.stringify(body)}
    Params ${JSON.stringify(params)}
    Query ${JSON.stringify(query)}
    Error ${JSON.stringify(this.standarError)}`)
}

function taskUserError({ body, params, query }) {
  console.error(`UserError
    Body ${JSON.stringify(body)}
    Params ${JSON.stringify(params)}
    Query ${JSON.stringify(query)}
    Error ${JSON.stringify(this.standarError)}`)
}

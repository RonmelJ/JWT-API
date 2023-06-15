export const queriesUser = {
    insertUser: `EXEC JWT_API.dbo.sp_insert_user @name, @email, @pass`,
    validEmail: `SELECT JWT_API.dbo.f_valid_email(@email) AS exist`,
    validLogin: `SELECT JWT_API.dbo.f_login(@email, @pass) AS valid`, //No usado
    getUserLogin: `SELECT * FROM JWT_API.dbo.Users WHERE email = @email`
}

export const queriesAdmin = {
    getAllUsers: `
        SELECT id, name, email, FORMAT(register_date, 'yyyy-MM-dd') 'register-day', 
            FORMAT(register_date, 'hh:mm:ss') 'register-time' 
        FROM JWT_API.dbo.Users ORDER BY id`,
    getUserById: `
        SELECT id, name, email, FORMAT(register_date, 'yyyy-MM-dd') 'register-day', 
            FORMAT(register_date, 'hh:mm:ss') 'register-time' 
        FROM JWT_API.dbo.Users WHERE id = @id`
}
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com"

/**
 * This class maintains the list of individual Story instances
 *  It also has some methods for fetching, adding, and removing stories
 */

class StoryList {
    constructor(stories) {
        this.stories = stories
    }

    /**
     * This method is designed to be called to generate a new StoryList.
     *  It:
     *  - calls the API
     *  - builds an array of Story instances
     *  - makes a single StoryList instance out of that
     *  - returns the StoryList instance.*
     */

    // Note the presence of `static` keyword: this indicates that getStories
    // is **not** an instance method. Rather, it is a method that is called on the
    // class directly. Why doesn't it make sense for getStories to be an instance method?
    static async getStories() {
        try {
            // query the /stories endpoint (no auth required)
            const response = await axios.get(`${BASE_URL}/stories`)

            // turn the plain old story objects from the API into instances of the Story class
            const stories = response.data.stories.map(story => new Story(story))

            // build an instance of our own class using the new array of stories
            const storyList = new StoryList(stories)
            return storyList
        } catch (err) {
            console.log("Getting Stories Failed due to: ", err)
        }
    }

    /**
     * Method to make a POST request to /stories and add the new story to the list
     * - user - the current instance of User who will post the story
     * - newStory - a new story object for the API with title, author, and url
     *
     * Returns the new story object
     */

    async addStory(user, newStory) {
        // TODO: Part 2 - Implement this function
        // this function should return the newly created story so it can be used in
        // the script.js file where it will be appended to the DOM
        try {
            const response = await axios({
                method: "POST",
                url: `${BASE_URL}/stories`,
                data: {
                    // request the body using the format specified by API 3.Create New Story
                    token: user.loginToken, // from User class
                    story: newStory,
                },
            })
            // make a Story instance out of the story object we get back
            newStory = new Story(response.data.story)
            // add the newStory to the beginning of the stories list
            this.stories.unshift(newStory)
            // add the newStory to the beginning of the user's list
            user.ownStories.unshift(newStory)

            return newStory
        } catch (err) {
            console.log("Adding Story Failed due to: ", err)
        }
    }

    async removeStory(user, storyId) {
        try {
            await axios({
                method: "DELETE",
                url: `${BASE_URL}/stories/${storyId}`,
                data: {
                    token: user.loginToken,
                },
            })

            // filter out the story whose ID we are removing
            this.stories = this.stories.filter(story => story.storyId !== storyId)

            // filter out the storyId to remove, for the user's list of stories
            user.ownStories = user.ownStories.filter(story => story.storyId !== storyId)

            // filter out the storyId to remove, for the user's favorite list of stories
            user.favorites = user.favorites.filter(story => story.storyId !== storyId)

        } catch (err) {
            console.log("Deleting Story Failed due to: ", err)
        }
    }
}


/**
 * The User class to primarily represent the current user.
 *  There are helper methods to signup (create), login, and getLoggedInUser
 */

class User {
    constructor(userObj) {
        this.username = userObj.username
        this.name = userObj.name
        this.createdAt = userObj.createdAt
        this.updatedAt = userObj.updatedAt

        // these are all set to defaults, not passed in by the constructor
        this.loginToken = "" // This token
        this.favorites = []
        this.ownStories = []
    }

    /** Create and return a new user.
     *
     * Makes POST request to API and returns newly-created user.
     *
     * - username: a new username
     * - password: a new password
     * - name: the user's full name
     */

    static async signUp(username, password, name) {
        try {
            const response = await axios.post(`${BASE_URL}/signup`, {
                user: {
                    username,
                    password,
                    name,
                },
            })

            // build a new User instance from the API response
            const newUser = new User(response.data.user)

            // attach the token to the newUser instance for convenience
            newUser.loginToken = response.data.token

            return newUser
        } catch (err) {
            console.log("Sign Up Failed due to: ", err)
        }
    }

    /** Login in user and return user instance.

     * - username: an existing user's username
     * - password: an existing user's password
     */

    static async login(username, password) {
        const response = await axios.post(`${BASE_URL}/login`, {
            user: {
                username,
                password,
            },
        })

        // build a new User instance from the API response
        const existingUser = new User(response.data.user)

        // instantiate Story instances for the user's favorites and ownStories
        existingUser.favorites = response.data.user.favorites.map(s => new Story(s))
        existingUser.ownStories = response.data.user.stories.map(s => new Story(s))

        // attach the token to the newUser instance for convenience
        existingUser.loginToken = response.data.token

        return existingUser
    }

    /** Get user instance for the logged-in-user.
     *
     * This function uses the token & username to make an API request to get details
     *   about the user. Then it creates an instance of user with that info.
     */

    static async getLoggedInUser(token, username) {
        // if we don't have user info, return null
        if (!token || !username) return null

        // call the API
        const response = await axios.get(`${BASE_URL}/users/${username}`, {
            params: {
                token,
            },
        })

        // instantiate the user from the API information
        const existingUser = new User(response.data.user)

        // attach the token to the newUser instance for convenience
        existingUser.loginToken = token

        // instantiate Story instances for the user's favorites and ownStories
        existingUser.favorites = response.data.user.favorites.map(s => new Story(s))
        existingUser.ownStories = response.data.user.stories.map(s => new Story(s))
        return existingUser
    }

    /**
     * This function fetches user information from the API at /users/{username} using a token.
     * Then it sets all the appropriate instance properties from the response with the current user instance.
     */
    async retrieveDetails() {
        try {
            const res = await axios.get(`${BASE_URL}/users/${this.username}`, {
                params: {
                    token: this.loginToken,
                },
            })

            // update User's properties from the API's response
            this.name = res.data.user.name
            this.username = res.data.user.username
            this.createdAt = res.data.user.createdAt

            // convert user's fav and stories into instances of Story
            this.favorites = res.data.user.favorites.map(s => new Story(s))
            this.ownStories = res.data.user.stories.map(s => new Story(s))

        } catch (err) {
            console.log("Retrieving detail failed due to: ", err)
        }
    }

    /**
     * Add a story to the list of user favorites and update the API
     * - storyId: an ID of a story to add to favorites
     */

    addFavorite(storyId) {
        return this._toggleFavorite(storyId, 'POST')
    }

    /**
     * Remove a story to the list of user favorites and update the API
     * - storyId: an ID of a story to remove from favorites
     */


    removeFavorite(storyId) {
        return this._toggleFavorite(storyId, 'DELETE')
    }

    /**
     * A helper method to either POST or DELETE to the API
     * - storyId: an ID of a story to remove from favorites
     * - httpVerb: POST or DELETE based on adding or removing
     */
    async _toggleFavorite(storyId, httpMethod) {
        await axios({
            method: httpMethod,
            url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
            data: {
                token: this.loginToken,
            },
        })

        await this.retrieveDetails()
        return this
    }

    /**
     * Send a PATCH request to the API in order to update the user
     * - userData: the user properties you want to update
     */
    async update(userData) {
        const res = await axios({
            method: "PATCH",
            url: `${BASE_URL}/users/${$this.username}`,
            data: {
                user: userData,
                token: this.loginToken,
            },
        })
        // update name
        this.name = res.data.user.name

        return this
    }

    /**
     * Send a DELETE request to the API in order to remove the user
     */
    async remove() {
        await axios({
            method: "DELETE",
            url: `${BASE_URL}/users/${this.username}`,
            data: {
                token: this.loginToken,
            },
        })
    }
}

/**
 * Class to represent a single story.
 */

class Story {

    /**
     * The constructor is designed to take an object for better readability / flexibility
     * - storyObj: an object that has story properties in it
     */

    constructor(storyObj) {
        this.author = storyObj.author
        this.title = storyObj.title
        this.url = storyObj.url
        this.username = storyObj.username
        this.storyId = storyObj.storyId
        this.createdAt = storyObj.createdAt
        this.updatedAt = storyObj.updatedAt
    }

    /**
     * Make a PATCH request against /stories/{storyID} to update a single story
     * - user: an instance of User
     * - storyData: an object containing the properties you want to update
     */

    async update(user, storyData) {
        const res = await axios({
            method: "PATCH",
            url: `${BASE_URL}/stories/${this.storyId}`,
            data: {
                token: user.loginToken,
                story: storyData,
            },
        })

        let {author, title, url, updatedAt} = res.data.story

        this.author = author
        this.title = title
        this.url = url
        this.updatedAt = updatedAt

        return this
    }
}

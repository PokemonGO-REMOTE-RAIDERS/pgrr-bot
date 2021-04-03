# PGRR Bot
The PGRR Bot is a custom Discord bot made for Pokémon Go Remote Raiders Discord Community.

## Setup / Configuration

Pull a local copy and run `npm install`

Add a `.env` file and ask @nhemp311 for the proper keys.

After installation is complete run `node index`

## Commands

- Brisbane Express
  - Coming Soon
- Community Day
  - Coming soon
- Fun
  - 8 Ball
- Utility
  - Reload
  - Help
- Waves
  - Delete
  - Get
  - Host
  - Notify
  - Profile
  - Set
  - String
  - Wave
  
  
 ## Brisbane Express
 ### Coming soon.
 
 ## Community Day
 ### Coming soon.
 
 ## Fun
 ### 8 Ball
 Ask the 8ball a question and it'll return a random response.  There are custom responses for Brisbane Express that only work in those channels.
 
 ## Utility
 ### Help
 This is a work in progress, but it'll eventually give a user information on a specific command.
 
 ### Reload
 Reloads a command.  This is a development feature to avoid having to exit in terminal and restarting.
 
 ## Waves

**Command:** `%set`

Allows a wavehost or higher (mod, senior mod, admin) to create an account and set the following values:

**Usage:** `%set ign nhemps311`

**Arguments:**

- `ign` In Game Name 
- `tc` Trainer Code
- `location` Location, can be simply your country, or as detailed as you want. 
- `rules` Your personal wave rules/guidelines
- `failed` The message you want to auto send when you say `wave failed`. 
- `failtc` This controls whether or not the bot adds your trainer code at the start of a failed wave.   set options are `TRUE` or `FALSE`
- `last` The message you want to auto send when you say `wave last`
- `closed` The message you want to be added to the wave close embed, triggered with `wave closed` when in active wave host session. 
- `timer` This is a timer that can be set to automatically delete your trainer code after the host command sets it. To set it you use the format of `10s`  => 10 seconds,  `5m` => 5 minutes, `1h` => 1 hour, etc. 

---

**Command:** `%get`

Gets an individual value from the wavehost profile.

**Usage:** `%get ign`  returns => nhemps311

**Arguments:**
- All of the data in `set` can be retrieved with `get`.

---

**Command:** `%host`

Starts a host session and populates an embed with wave host data, tags waveriders and a boss, and inserts users .

**Usage:** `%host <bossRole>`

**Arguments:**

- `@bossrole` You can tag a boss role, for example @Thundurus Therian , and it will add it to the embed card as well as track that data to the host session.

---


**Command:** `wave`

*This command does not require you to use the prefix (%).*

This is the meat and potatoes of hosting waves.  There's a lot going on with this, and will probably change slightly over time, but the release version is enough to get us going. 

The wave command is the only command that can be used by anyone on the server.  However, only wave hosts can use ALL of the functionality. 

`wave` will automatically count your current wave after you've typed `%host` starting at 0.  So you can technically run an entire wave with just using `wave next`.  

**Usages:** `wave next`   `wave 5`   `wave closed`

**Arguments:**
:red_circle: Only works in hosting scenario*

- `anynumber` This is the default functionality that any user can use.  simply say `wave #` and it'll return the embed with the default message.  
- :red_circle: `next` Increments wave number to the next from the current wave.  
- :red_circle: `failed` Sends users your failed message and temporarily posts your trainer code for 30 seconds and then auto deletes it. This will also increment your failed counter.
- :red_circle: `last` Increments the wave number and sends your `%set last` message to users.
- :red_circle: `closed`  Does the following: 
  - Closes out the hosting session.
  - Sends you an overview of your host session.
  - Appends your `%set closed` message to the description.
  - Displays a congratulations message should you beat your personal record.
  - Adds wave information to the wave history database with the following datapoints:
    - userid
    - ign (incase you ran on an alt)
    - starttime
    - endtime
    - duration
    - channel
    - channelname
    - boss
    - waves
    - fails
    
 ---
 
 
**Command:** `%delete`

This command will delete your trainer code that the bot automatically sets.  It can be used even if you have a timer set. 

**Usage:** `%delete`

**No Arguments**

--- 

**Command:** `%profile`

This command will pull back your profile information. 

**Usage:** `%profile stats`  or `%profile settings`

**Arguments:** 

- `settings` This will let you see your personal settings. 
- `stats` This will pull back statistics of your wave host history.

--- 


**Command:** `%notify`

This command is to be used WHILE HOSTING it will send a notification to the channel and tag: <boss>, @WAVE 🌊 RIDER, and @BF Raids in case you need to drum up more interest. 

**Usage:** `%notify`

**No Arguments**

--- 

**Command:** `%string`

Takes a screenshot and returns a comma separated string of trainernames that are truncated to 5 characters and lowercase.  Must be used on a screenshot of the Friend Request screen in PoGo.

**Usage:** `%string (attach screenshots)`

<img src="https://cdn.discordapp.com/attachments/825392162232860692/828006118437421056/full-list.jpg" alt="Screenshot" width="300px">

**Returns:** mallo, jennj, paisl, kiya7, sappy

**No Arguments**

--- 

__**Setup Instructions**__

:one: Type `%set ign yourInGameName`

:two: Type `%set tc yourTrainerCode`

:three: Type `%set rules yourRules` 

*Note: Rules are set up on an individual wave host basis, if you have questions, ask another wave host for guidance.*

:four: Type `%set location yourLocation` 

*Note: Can be just your country or continent, be as non-specific as you want.*

:five: Type `%set failed yourFailedMessage` 

*Note: Type what do you want the bot to say when you use `wave failed`.*

:six: Type `%set failedtc [true or false]` 

*Note: If you want the bot to show your trainer code on a failed wave use `true` otherwise use `false`

:seven: Type `%set last yourLastMessage` 

*Note: Type what you want the bot to say when you use `wave last`

:eight: Type `%set closed yourClosedMessage` 

*Note: Type what you want the bot to say when you use `wave closed`

:information_source: Type `%profile settings` to see all of your information in one embed. 

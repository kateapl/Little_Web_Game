class SoundsManager
{
    themeSound = null;
    gameManager = null;
    jumpSound = null;


    constructor(gameManager)
    {
        this.gameManager = gameManager;
        this.themeSound = new Audio("sounds/Theme.mp3");
        this.jumpSound = new Audio("sounds/jump.mp3");

        let soundManager = this;
        this.themeSound.addEventListener('canplaythrough', () => { soundManager.playTheme() }, false);
    }

    jump()
    {
        this.jumpSound.volume = 0.8;
        this.jumpSound.play();
    }

    playTheme()
    {
        if(this.themeSound.paused)
        {
            this.themeSound.loop = true;
            this.themeSound.volume = 0.2;
            this.themeSound.play();
        }
        else
        {
            this.themeSound.pause();
        }
    }


}
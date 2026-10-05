import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {

    //1. Private locators

    private readonly emailId: Locator
    private readonly password: Locator
    private readonly login: Locator
    private readonly forgottenPasswordLink: Locator
    private readonly loginErrorMessage: Locator


    //2. Constructor of the page class: init the locators

    constructor(page: Page) {
        super(page)
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' })
        this.password = page.getByLabel('Password')
        this.login = page.getByRole('button', { name: 'Login' })
        this.forgottenPasswordLink = page.getByRole('link', { name: 'Forgotten Password' }).first()
        this.loginErrorMessage = this.page.locator('.alert.alert-danger.alert-dismissible')
    }


    //3. Public page actions (methods) / behavior: encapsulation

    async goToLoginPage(): Promise<void> {
        await this.page.goto('/opencart/index.php?route=account/login')
    }

    async isForgottenPwdLinkExist(): Promise <boolean> {
        return await this.forgottenPasswordLink. isVisible()

    }

    async doLogin(username: string, password: string): Promise <void>{
        console.log(`user creds: ${username} - ${password}`)
        await this.emailId.fill(username)
        await this.password.fill(password)
        await this.login.click()

    }

    async isInvalidLoginErrorDisplayed(): Promise <boolean> {
        return await this.loginErrorMessage.isVisible()




    }

}
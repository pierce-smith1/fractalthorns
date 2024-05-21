import * as Splash from "../../../descriptors/splash";
import * as SplashLoader from "../../../loaders/splash";
import * as Endpoint from "../../../endpoint";

export const POST = Endpoint.use_post_handler<"submit_splash">(async request => {
    const model: Splash.Model = {
        text: request.text,
        author: request.author,
        submitted_on: new Date(), 
    };

    await SplashLoader.save(model);
});

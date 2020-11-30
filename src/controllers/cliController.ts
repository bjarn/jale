abstract class CliController {

    constructor() {

    }

    abstract execute(): Promise<boolean>;

}

export default CliController
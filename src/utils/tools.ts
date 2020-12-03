import Drush from '../tools/drush'
import Magerun from '../tools/magerun'
import Magerun2 from '../tools/magerun2'
import Tool from '../tools/tool'
import WpCli from '../tools/wpCli'

const getToolByName = (toolName: string): Tool => {
    let tool: Tool

    switch (toolName) {
        // TODO: Improve the way we handle these checks. This is very NOT memory efficient
        //  as we are constantly initiating new objects.
        case (new WpCli).alias || (new WpCli).name:
            tool = new WpCli()
            break
        case (new Magerun).alias || (new Magerun).name:
            tool = new Magerun()
            break
        case (new Magerun2).alias || (new Magerun2).name:
            tool = new Magerun2()
            break
        case (new Drush).alias || (new Drush).name:
            tool = new Drush()
            break
        default:
            throw Error('Invalid tool: ' + toolName)
    }

    return tool
}

export {
    getToolByName
}
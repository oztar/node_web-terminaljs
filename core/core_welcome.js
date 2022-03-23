'use strict'

let welcome ="\r\n";
welcome +=' #     # ####### #        #####  ####### #     # #######       '+"\r\n";
welcome +=' #  #  # #       #       #     # #     # ##   ## #             '+"\r\n";
welcome +=' #  #  # #       #       #       #     # # # # # #             '+"\r\n";
welcome +=' #  #  # #####   #       #       #     # #  #  # #####         '+"\r\n";
welcome +=' #  #  # #       #       #       #     # #     # #             '+"\r\n";
welcome +=' #  #  # #       #       #     # #     # #     # #             '+"\r\n";
welcome +='  ## ##  ####### #######  #####  ####### #     # #######       '+"\r\n";
welcome +='                                                               '+"\r\n";
welcome +='    ####### ####### ######  #     # ### #     #    #    #      '+"\r\n";
welcome +='       #    #       #     # ##   ##  #  ##    #   # #   #      '+"\r\n";
welcome +='       #    #       #     # # # # #  #  # #   #  #   #  #      '+"\r\n";
welcome +='       #    #####   ######  #  #  #  #  #  #  # #     # #      '+"\r\n";
welcome +='       #    #       #   #   #     #  #  #   # # ####### #      '+"\r\n";
welcome +='       #    #       #    #  #     #  #  #    ## #     # #      '+"\r\n";
welcome +='       #    ####### #     # #     # ### #     # #     # #######'+"\r\n";
welcome +='jquery version v3.41.1. \n';
welcome +='jquery terminal version v2.29.2 \n';
welcome +='Web Terminal Js CLI version v'+process.env.npm_package_dependencies_web_terminaljs.substring(1);

module.exports = function(socketid){
    //msg welcome
    this.emit(socketid,welcome);
    
    //send list autocoplete for socket
    for( let id in this.options.list_auto_command){
	this.emit('send_autocomplete',id,this.options.list_auto_command[id]);
    }    
}

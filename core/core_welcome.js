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
welcome +='jquery version v3.41.1.\n';
welcome +='jquery terminal version v2.34.0\n';
welcome +='Web Terminal Js CLI version v0.3.8';

module.exports = function(socketid){
    //msg welcome
    this.emit(socketid,welcome);
    
    //send list autocoplete for socket
    for( let id in this.options.list_auto_command){
	this.emit('send_autocomplete',id,this.options.list_auto_command[id]);
    }    
}

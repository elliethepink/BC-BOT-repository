// System - Subs: you don't have permission to orgasm. Dom: have fun.
//
//
// -----------------------------------------------------------------------------


permissionCost = 5
punishmentCost = 10
DomLv2Cost = 10
adulationCost = 3
VibratorModeList = ["Off","Low","Medium","High","Maximum"]

// new line in chat - BEGIN
nl = `
`
// new line in chat - END

if (personMagicData.prototype.rules == null) {
  personMagicData.prototype.rules = ["denial"]
} else if (personMagicData.prototype.rules.indexOf("denial") == -1) {
  personMagicData.prototype.rules.push("denial")
}

if (personMagicData.prototype.orderDict == null) {
  personMagicData.prototype.orderDict = {}
}


ChatRoomMessageAdditionDict["EnterLeave"] = function(SenderCharacter, msg, data) {ChatRoomMessageEnterLeave(SenderCharacter, msg, data)}
ChatRoomMessageAdditionDict["DenialShop"] = function(SenderCharacter, msg, data) {ChatRoomMessageDenialShop(SenderCharacter, msg, data)}
ChatRoomMessageAdditionDict["DenialRule"] = function(SenderCharacter, msg, data) {ChatRoomMessageDenialRule(SenderCharacter, msg, data)}

Player.Description = `Welcome to ` + Player.Name + ` DENIAL BAR

FOR SUBMISSIVE CUSTOMERS:
To all our subs customer we provide a free vibrating dildo and chastity belt upon entering.
Those that demonstrate to have solid submissive history will also receive a complementary anal vibrator!
Just remember that in our establishment you are prohibited to have orgasms, unless properly authorized by one of our mistress customers.
Transgressors will be harshly punished.

FOR DOMINANT CUSTOMERS:
Our naive submissive dol- customers are here for your pleasure. Play with them, tease them and make them beg for your own amusing!
The more you arouse them the more credit (points) you will receive.
Use your hard earned points to buy new items to tease and reward your favorite play toy.

RULES:
- Orgasms are prohibited
- Messing with the vibrators is prohibited
You will receive one strike each time you break a rule. After 3 strikes you will be dollified.
To be released from your dollification predicament you have to demonstrate your obedience resisting 2 orgasms.

------------------------------------------------
SHOP:
In the shop you will be able to buy the following items:
- Orgasm permission (` + permissionCost + ` points): give this permission to whoever you want (yourself included) to allow them to have a nice orgasm! A nice reward for a good girl.
- DomLv2 (` + DomLv2Cost + ` points): upgrade your status inside this bar, you will be given the authority to change the vibrators settings as you wish. But remember: turning them off is always prohibited!
- Adulation (` + adulationCost + ` points): we want you to feel apprecciated while you are here. You will get some lovely attentions.
------------------------------------------------
COMMANDS: all commands must be whispered.

!leave - you will be freed and kicked out of the room.

Following commands are for dommes only.
!point - check how many points you have.
!shop - identical to !buy, read below.
!buy - look at the available items in the shop.
!buy permission <name> - buy a permission for <name>
!buy DomLv2 - upgrade your status in the room.
!buy adulation - someone will make you feel apprecciated.
` // end of description
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player)


function ChatRoomMessageEnterLeave(SenderCharacter, msg, data) {
  if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
    setTimeout(enterLeaveEvent,1*1000,SenderCharacter,msg)
  } else if (data.Type != null && SenderCharacter.MemberNumber != Player.MemberNumber) {
    if ((data.Type == "Chat") || (data.Type == "Whisper")) {
      if (msg.includes("!leave")) {
        // remove all locks, dildo, chastitybelt and kick
        free(SenderCharacter.MemberNumber, update = false)
        InventoryRemove(SenderCharacter,"ItemPelvis")
        InventoryRemove(SenderCharacter,"ItemVulva")
        InventoryRemove(SenderCharacter,"ItemButt")
        ChatRoomCharacterUpdate(SenderCharacter)
        ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())
      }
    }
  }
}

function ChatRoomMessageDenialShop(SenderCharacter, msg, data) {
  if (data.Type != null && SenderCharacter.MemberNumber != Player.MemberNumber) {

    if ((data.Type == "Chat") || (data.Type == "Whisper")) {
      if (msg.includes("!point") && customerList[SenderCharacter.MemberNumber].role.includes("dom")) {
        ServerSend("ChatRoomChat", { Content: "(Private) Points: " + customerList[SenderCharacter.MemberNumber].points, Type: "Chat", Target: SenderCharacter.MemberNumber} );
      } if ((msg.toLowerCase().includes("!buy") || msg.toLowerCase().includes("!shop")) && customerList[SenderCharacter.MemberNumber].role.includes("sub")) {
        ServerSend("ChatRoomChat", { Content: "(Private) You want to buy somthing in my shop? Maybe a permission to orgmasm? Well I am sorry sweety, but only women I recognize as dominants can buy in my shop. Maybe you will be able to find one that will decide to play with you... Hihihi.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
      } if ((msg.toLowerCase().includes("!buy") || msg.toLowerCase().includes("!shop")) && customerList[SenderCharacter.MemberNumber].role.includes("dom")) {
        if (msg.toLowerCase().includes("permission")) {
          if (customerList[SenderCharacter.MemberNumber].points>=permissionCost) {
            var nameFound = false
            for (var D = 0; D < ChatRoomCharacter.length; D++) {
              if (msg.toLowerCase().endsWith(ChatRoomCharacter[D].Name.toLowerCase())) {
                console.log(SenderCharacter.Name + " bought permission.")
                customerList[ChatRoomCharacter[D].MemberNumber].allowedOrgasmNum += 1
                customerList[SenderCharacter.MemberNumber].points -= permissionCost
                nameFound = true
                ServerSend("ChatRoomChat", { Content: "*" + SenderCharacter.Name + " has bought an orgasm permission for you. You have now " + customerList[ChatRoomCharacter[D].MemberNumber].allowedOrgasmNum + " permissions.", Type: "Chat", Target: ChatRoomCharacter[D].MemberNumber} );
                ServerSend("ChatRoomChat", { Content: "*Permission bought. Points remaining : " + customerList[SenderCharacter.MemberNumber].points , Type: "Emote", Target: SenderCharacter.MemberNumber} );
                break
              }
            }
            if (!nameFound) ServerSend("ChatRoomChat", { Content: "(Private) You have to choose someone. !buy permission <name>. You can also name yourself.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
          } else {
            ServerSend("ChatRoomChat", { Content: "(Private) You don't have enough points.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
          }
        } else if (msg.toLowerCase().includes("punishment")) {
          if (customerList[SenderCharacter.MemberNumber].points>=punishmentCost) {
            var nameFound = false
            for (var D = 0; D < ChatRoomCharacter.length; D++) {
              if (msg.toLowerCase().endsWith(ChatRoomCharacter[D].Name.toLowerCase())) {
                if (ChatRoomCharacter[D]==Player) {
                  ServerSend("ChatRoomChat", { Content: "Eheh, so you'd like to see me tied up? Soo nice of you. But my Mistress ordered me to manage this place... maybe another time?", Type: "Chat", Target: SenderCharacter.MemberNumber} );
                  nameFound = true
                } else {
                  console.log(SenderCharacter.Name + " bought punishment.")
                  buyPunishment(SenderCharacter,ChatRoomCharacter[D])
                  customerList[SenderCharacter.MemberNumber].points -= punishmentCost
                  nameFound = true
                  ServerSend("ChatRoomChat", { Content: "*Punishment bought. Points remaining : " + customerList[SenderCharacter.MemberNumber].points , Type: "Emote", Target: SenderCharacter.MemberNumber} );
                }
                break
              }
            }
            if (!nameFound) ServerSend("ChatRoomChat", { Content: "(Private) You have to choose someone. !buy punishment <name>. You can also name yourself.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
            } else {
              ServerSend("ChatRoomChat", { Content: "(Private) You don't have enough points.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
            }
          } else if (msg.toLowerCase().includes("domlv2") && customerList[SenderCharacter.MemberNumber].role == "dom") {
            if (customerList[SenderCharacter.MemberNumber].points>=DomLv2Cost) {
              console.log(SenderCharacter.Name + " bought DomLv2.")
              customerList[SenderCharacter.MemberNumber].points -= DomLv2Cost
              promoteToDom2(SenderCharacter)
              ServerSend("ChatRoomChat", { Content: "(Private) You can now freely change the vibrator settings. But remember that you can NEVER turn them off! Have fun.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
              ServerSend("ChatRoomChat", { Content: "*Level up bought. Points remaining : " + customerList[SenderCharacter.MemberNumber].points , Type: "Emote", Target: SenderCharacter.MemberNumber} );
            } else {
              ServerSend("ChatRoomChat", { Content: "(Private) You don't have enough points.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
            }
          } else if (msg.toLowerCase().includes("adulation")) {
            if (customerList[SenderCharacter.MemberNumber].points>=adulationCost) {
              var subList = []
              for (var D = 0; D < ChatRoomCharacter.length; D++) {
                if (ChatRoomCharacter[D].MemberNumber in customerList && !customerList[ChatRoomCharacter[D].MemberNumber].beingPunished && customerList[ChatRoomCharacter[D].MemberNumber].role.includes("sub") && !("adulation" in customerList[ChatRoomCharacter[D].MemberNumber].orderDict)) {
                  subList.push(ChatRoomCharacter[D].MemberNumber)
                }
              }
              if (subList.length == 0) {
                ServerSend("ChatRoomChat", { Content: "(Private) There are no available submissve customers at the moment. You cannot buy this item.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
              } else {
                customerList[SenderCharacter.MemberNumber].points -= adulationCost
                const targetMemberNumber = subList[Math.floor(Math.random() * subList.length)]
                console.log(SenderCharacter.Name + " bought Adulation. Sub -> " + customerList[targetMemberNumber].name)
                customerList[targetMemberNumber].orderDict = {"adulation": {timeoutHandle: setTimeout(adulationCheck, 5*60*1000, targetMemberNumber), adulationTarget: SenderCharacter.MemberNumber}}
                ServerSend("ChatRoomChat", { Content: "(Private) " + customerList[targetMemberNumber].name + " will take care of that.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
                ServerSend("ChatRoomChat", { Content: "(Private) ORDER: kiss " + SenderCharacter.Name + "'s feet or you will receive one strike.", Type: "Chat", Target: targetMemberNumber} );
              }
            } else {
              ServerSend("ChatRoomChat", { Content: "(Private) You don't have enough points.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
            }
          } else {
            mess = `To buy an item say '!buy <item>'.
            Here is a list of available items:
            -----------------------------------
            Permission (`+permissionCost+` pt)
            Adulation (`+adulationCost+` pt)`

            if (customerList[SenderCharacter.MemberNumber].role != "dom2") {
              mess = mess + `DomLv2 (change vibrator settings) (`+DomLv2Cost+` pt)` + nl
            }
            mess = mess + `-----------------------------------`

            ServerSend("ChatRoomChat", { Content: mess, Type: "Chat", Target: SenderCharacter.MemberNumber} );
          }
        }
      } else if ((data.Type == "Activity")) {
        if (customerList[SenderCharacter.MemberNumber].role.includes("dom")) {
          if (0-customerList[SenderCharacter.MemberNumber].lastActivity + Date.now() > 30000) {
            var TargetMemberNumber = null;
            var ActivityName = null;
            var ActivityGroup = null;
            if (data.Dictionary != null) {
              for (var D = 0; D < data.Dictionary.length; D++) {
                if ((data.Dictionary[D].MemberNumber != null) && (data.Dictionary[D].Tag == "TargetCharacter")) TargetMemberNumber = data.Dictionary[D].MemberNumber;
                if (data.Dictionary[D].Tag == "ActivityName") ActivityName = data.Dictionary[D].Text;
                if (data.Dictionary[D].Tag == "ActivityGroup") ActivityGroup = data.Dictionary[D].Text;
              }
            }
            if (TargetMemberNumber != null) {
              if (customerList[TargetMemberNumber].beingPunished || !customerList[TargetMemberNumber].role.includes("sub")) {
                ServerSend("ChatRoomChat", { Content: "(Private) Sorry, but no points will be awarded to arouse non-submissive girls or girls being punished. Still, feel free to enjoy them!", Type: "Chat", Target: SenderCharacter.MemberNumber} );
              } else {
                for (var D = 0; D < ChatRoomCharacter.length; D++) {
                  if (TargetMemberNumber == ChatRoomCharacter[D].MemberNumber) {
                    targetChar = ChatRoomCharacter[D]
                    break
                  }
                }
                // Converts from activity name to the activity object
                if (typeof ActivityName === "string") ActivityName = AssetGetActivity(targetChar.AssetFamily, ActivityName);
                if ((ActivityName == null) || (typeof ActivityName === "string")) return;

                // Calculates the next progress factor
                var Factor = (PreferenceGetActivityFactor(targetChar, ActivityName.Name, (targetChar.ID == 0)) * 5) - 10; // Check how much the character likes the activity, from -10 to +10
                Factor = Factor + (PreferenceGetZoneFactor(targetChar, ActivityGroup) * 5) - 10; // The zone used also adds from -10 to +10

                pointsGained = Math.floor(Factor / 10) + 1
                customerList[SenderCharacter.MemberNumber].points += pointsGained
                ServerSend("ChatRoomChat", { Content: "*[Points: " + customerList[SenderCharacter.MemberNumber].points + " (+ " + pointsGained + ")]", Type: "Emote", Target: SenderCharacter.MemberNumber} );
                console.log(SenderCharacter.Name + " points gained :" + pointsGained)
              }
            }
          }
          if (TargetMemberNumber != null) {customerList[SenderCharacter.MemberNumber].lastActivity = Date.now()}
        } else if (customerList[SenderCharacter.MemberNumber].role.includes("sub")) {
          if ("adulation" in customerList[SenderCharacter.MemberNumber].orderDict) {
            if (msg.includes("ChatOther") && msg.includes("Kiss") && (msg.includes("ItemBoots") || msg.includes("ItemFeet"))) {
              var dictionary = data.Dictionary;
              var TargetMemberNumber = null;
              for (let D = 0; D < dictionary.length; D++) {
                if (dictionary[D].MemberNumber) {
                  if ((dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName")) {
                    if (dictionary[D].MemberNumber == customerList[SenderCharacter.MemberNumber].orderDict["adulation"]["adulationTarget"]) {
                      ServerSend("ChatRoomChat", { Content: "(Private): you did good.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
                      clearTimeout(customerList[SenderCharacter.MemberNumber].orderDict["adulation"]["timeoutHandle"])
                      delete customerList[SenderCharacter.MemberNumber].orderDict["adulation"]
                      console.log(SenderCharacter.Name + " performed adulation on " + customerList[dictionary[D].MemberNumber].name)
                    }
                  }
                }
              }
            }
          }
        }
      }	else if ((data.Type == "Emote")) {
        //
      } else if ((data.Type == "Whisper")) {
        //
      }
    }
}

function ChatRoomMessageDenialRule(SenderCharacter, msg, data) {
  if (data.Type != null && SenderCharacter.MemberNumber != Player.MemberNumber) {
    if ((data.Type == "Action")) {
      // console.log("msg :" + msg)
      // console.log("Keys :" + Object.keys(data.Dictionary))
      // console.log("Dictionary 0 :" + data.Dictionary[0].MemberNumber)
      if ((msg.includes("Vibe") || msg.includes("Dildo") || msg.includes("Buttplug")) && (msg.includes("creaseTo-1") || ((msg.includes("creaseTo") || msg.includes("ModeChange")) && customerList[SenderCharacter.MemberNumber].role != "dom2"))) {
        ServerSend("ChatRoomChat", { Content: SenderCharacter.Name +"! Do not mess with the vibrators, you are not allowed to do that. This is a strike for you!", Type: "Chat"}); //Target: SenderCharacter.MemberNumber} );
        customerList[SenderCharacter.MemberNumber].strike = customerList[SenderCharacter.MemberNumber].strike +1
        targetMemberNumber = data.Dictionary[0].MemberNumber
        for (R = 0; R < ChatRoomCharacter.length; R++) {
          if (ChatRoomCharacter[R].MemberNumber == targetMemberNumber) {
            dildoAsset = InventoryGet(ChatRoomCharacter[R], "ItemVulva")
            buttAsset = InventoryGet(ChatRoomCharacter[R], "ItemButt")
            if (dildoAsset) {
              dildoAsset.Property = {Mode: VibratorModeList[customerList[targetMemberNumber].vulvaIntensity+1], 'Intensity': customerList[targetMemberNumber].vulvaIntensity, Effect: ["Egged"]}
              if (customerList[targetMemberNumber].vulvaIntensity>-1) {dildoAsset.Property.Effect = ["Egged","Vibrating"]}
            }
            if (buttAsset) {
              buttAsset.Property= {'Intensity': customerList[targetMemberNumber].buttIntensity, Effect: ["Egged"]}
              if (customerList[targetMemberNumber].buttIntensity>-1) {buttAsset.Property.Effect = ["Egged","Vibrating"]}
            }
            ChatRoomCharacterUpdate(ChatRoomCharacter[R])
            ServerSend("ChatRoomChat", { Content: "*The vibrator automatically returns to the initial setting.", Type: "Emote"} );
          }
        }
        if (customerList[SenderCharacter.MemberNumber].strike > 2) {
          ServerSend("ChatRoomChat", { Content: "Now you are going to be punished.", Type: "Chat"} );
          dressLike(SenderCharacter.MemberNumber,"doll", update = false)
          dollLock(SenderCharacter)
          customerRoleDildo(SenderCharacter, force = true)
          ChatRoomCharacterUpdate(SenderCharacter)
          customerList[SenderCharacter.MemberNumber].beingPunished = true
          ServerSend("ChatRoomChat", { Content: "You will now stay like this for a while. Try resisting a couple of orgasms and I may decide to free you again.", Type: "Chat", Target: SenderCharacter.MemberNumber} );
        }
      }
      //
    } else if ((data.Type == "Activity")) {
      if (msg.includes("OrgasmResist")) {
        if (customerList[SenderCharacter.MemberNumber].beingPunished) {
          customerList[SenderCharacter.MemberNumber].orgasmResisted = customerList[SenderCharacter.MemberNumber].orgasmResisted + 1
          if (customerList[SenderCharacter.MemberNumber].orgasmResisted >= 2) {
            ServerSend("ChatRoomChat", { Content: "Okay " + SenderCharacter.Name + ". I hope you have learned your lesson. You are free now.", Type: "Chat"} );
            customerList[SenderCharacter.MemberNumber].orgasmResisted = 0
            customerList[SenderCharacter.MemberNumber].strike = 0
            customerList[SenderCharacter.MemberNumber].beingPunished = false
            free(SenderCharacter.MemberNumber, update = false)
            reapplyClothing(SenderCharacter, update = false)
            customerRoleDildo(SenderCharacter)
            ChatRoomCharacterUpdate(SenderCharacter)
          }
        }
      } else if (msg.includes("Orgasm") && customerList[SenderCharacter.MemberNumber].rules.indexOf("denial")>-1 && !customerList[SenderCharacter.MemberNumber].beingPunished) {
        if (customerList[SenderCharacter.MemberNumber].allowedOrgasmNum>0) {
          customerList[SenderCharacter.MemberNumber].allowedOrgasmNum -= 1
          ServerSend("ChatRoomChat", { Content: "*[One orgasm permission used. Orgasm permission remaining: " + customerList[SenderCharacter.MemberNumber].allowedOrgasmNum + "]", Type: "Emote", Target: SenderCharacter.MemberNumber} );
        } else {
         setTimeout(orgasmReaction,5*1000,SenderCharacter);
        }
      }
    }
  }
}


function enterLeaveEvent(sender,msg) {
  //if (InventoryAllow(sender, "AccessBreast") || InventoryAllow(sender, "AccessVulva") || sender.IsRestrained() || CharacterIsInUnderwear(sender) || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsDeaf()) {
  //  ServerSend("ChatRoomChat", { Content: "*[To play here you have to be UNRESTRAINED and fully DRESSED (check your pantinies too). You will be kicked in 10 seconds. You can change and comeback if you want.]", Type: "Emote", Target: sender.MemberNumber} );
  //  setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 10*1000, sender)
  if (sender.ItemPermission>2) {
    ServerSend("ChatRoomChat", { Content: "*[To play here you have to lower your PERMISSION. You will be kicked in 10 seconds. You can change and comeback if you want.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 10*1000, sender)
  } else if (InventoryIsPermissionBlocked(sender, "SmallWoodenBox","ItemDevices") || InventoryIsPermissionBlocked(sender, "LowCage","ItemDevices")) {
    ServerSend("ChatRoomChat", { Content: "*[To play here you have to give PERMISSION to use the SMALL WOODEN BOX and the KENNEL. You will be kicked in 10 seconds. You can change and comeback if you want.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 10*1000, sender)
  } else if (InventoryIsPermissionBlocked(sender, "BoxTieArmbinder","ItemArms") || InventoryIsPermissionBlocked(sender, "ClothStuffing","ItemMouth") || InventoryIsPermissionBlocked(sender, "HarnessPanelGag","ItemMouth2") || InventoryIsPermissionBlocked(sender, "LatexPostureCollar","ItemMouth3") || InventoryIsPermissionBlocked(sender, "LatexBlindfold","ItemHead") || InventoryIsPermissionBlocked(sender, "SpreaderMetal","ItemFeet")) {
    ServerSend("ChatRoomChat", { Content: "*[To play here you have to give PERMISSION to use the BOX TIE ARMBINDER, the CLOTH STUFFING, the HARNESS PANEL GAG, the LATEX POSTURE COLLAR, the LATEX BLINDFOLD and the SPREADER METAL BAR. You will be kicked in 10 seconds. You can change and comeback if you want.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 10*1000, sender)
	} else if (InventoryIsPermissionBlocked(sender, "PolishedChastityBelt","ItemPelvis") || InventoryIsPermissionBlocked(sender, "VibratingDildo","ItemVulva")) {
    ServerSend("ChatRoomChat", { Content: "*[To play here you have to give PERMISSION to use the Polished Chastity Belt and the Vibrating Dildo. You will be kicked in 10 seconds. You can change and comeback if you want.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 10*1000, sender)
  } else if (sender.ArousalSettings != null && sender.ArousalSettings.Active != "Hybrid" && sender.ArousalSettings.Active != "Automatic") {
    ServerSend("ChatRoomChat", { Content: "*[To play here you have to set the preference for sexual the activities to hybrid or automatic (locked). You will be kicked in 10 seconds. You can change and comeback if you want.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 10*1000, sender)
  } else {
		ServerSend("ChatRoomChat", { Content: "*[ROOM EXPLANATION: orgasm are prohibited. More info in " + Player.Name + " Bio. READ IT]", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*[Say or whisper '!leave' and all the locks on you will be unlocked, but you will also be kicked out.]", Type: "Emote", Target: sender.MemberNumber} );
		if (sender.MemberNumber in customerList) {
			ServerSend("ChatRoomChat", { Content: "Welcome back " + sender.Name + ". Don't worry I didn't forget about you. Hihihi.", Type: "Chat", Target: sender.MemberNumber} );
			if (customerList[sender.MemberNumber].beingPunished) {
				dressLike(sender.MemberNumber,"doll", update = false),
        dollLock(sender)
				customerRoleDildo(sender, force = true)
			} else {
				customerRoleDildo(sender)
			}
			ChatRoomCharacterUpdate(sender)
		} else {
			newCustomer(sender)
		}
	}
  //console.log(sender.Name + "ENTERED")
}

function orgasmReaction(sender) {
	if (customerList[sender.MemberNumber].strike <= 2) {
		ServerSend("ChatRoomChat", { Content: sender.Name + ", you had an orgasm without permission. I am kind, but at the third strike I WILL punish you.", Type: "Chat", Target: sender.MemberNumber} );
		customerList[sender.MemberNumber].strike = customerList[sender.MemberNumber].strike + 1
	} else {
		ServerSend("ChatRoomChat", { Content: sender.Name + ", you had an orgasm without permission, again. You need to be punished.", Type: "Chat"} );
    givePunishment(sender)
	}
}

function givePunishment(sender) {
  dressLike(sender.MemberNumber,"doll", update = false)
  dollLock(sender)
  customerRoleDildo(sender, force = true)
  ChatRoomCharacterUpdate(sender)
  customerList[sender.MemberNumber].beingPunished = true
  ServerSend("ChatRoomChat", { Content: "You will now stay like this for a while. Try resisting a couple of orgasms and I may decide to free you again.", Type: "Chat"} );
}

function customerRoleDildo(sender, force = false) {
	role = customerList[sender.MemberNumber].role
	//console.log(sender.Name + " Role: " + role)
	if (role == "sub2") {
		//console.log(sender.Name + "sub2 IF")
		InventoryWear(sender, "VibratingButtplug","ItemButt","Default")
		InventoryGet(sender,"ItemButt").Property = { Intensity: customerList[sender.MemberNumber].buttIntensity, Effect: ["Egged","Vibrating"] }
		//InventoryGet(sender,"ItemButt").Asset.Effect = []
	}
	if (role.includes("sub") || force) {
		//console.log(sender.Name + "sub IF")
		InventoryWear(sender, "VibratingDildo","ItemVulva","Default")
		InventoryGet(sender,"ItemVulva").Property = {Mode: VibratorModeList[customerList[sender.MemberNumber].vulvaIntensity+1], Intensity: customerList[sender.MemberNumber].vulvaIntensity, Effect: ["Egged", "Vibrating"] }
		//InventoryGet(sender,"ItemVulva").Asset.Effect = []
		InventoryWear(sender, "PolishedChastityBelt", "ItemPelvis","Default",100)
		InventoryGet(sender,"ItemPelvis").Property = {Block: [ "ItemButt" ], Restrain: "ClosedBack"}
		InventoryLock(sender, InventoryGet(sender, "ItemPelvis"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")})
		InventoryGet(sender, "ItemPelvis").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
		//CharacterLoadEffect(sender)
	}
}

function newCustomer(sender) {
	customerList[sender.MemberNumber] = new personMagicData()
  customerList[sender.MemberNumber].name = sender.Name
	if (OnlineReputationGet(sender,"Dominant")<50) {
		ServerSend("ChatRoomChat", { Content: sender.Name + ", a dildo and a chastity belt have been locked on you, have fun! But not too much or I will punish you.", Type: "Chat", Target:sender.MemberNumber} );
		customerList[sender.MemberNumber].role ='sub1'
	} else {
		ServerSend("ChatRoomChat", { Content: "Greetings " +sender.Name + ", welcome to my special shop. You have now the possiblity to earn points by... arousing other girls here. Then you will be able to use those point to !buy some of our particular offers. Just remember that I will not award any points if you rush too much. Just take the time to play and arouse these nice girls.", Type: "Chat", Target:sender.MemberNumber} );
		customerList[sender.MemberNumber].role = 'dom'
    customerList[sender.MemberNumber].points = 5
	}
	if (OnlineReputationGet(sender,"Dominant")<=-50) {
		ServerSend("ChatRoomChat", { Content: "Also, since you seems very submissive to me, I have decided to give you something else you may appreciate. A second vibrating dildo. Hihihi.", Type: "Chat", Target:sender.MemberNumber} );
		customerList[sender.MemberNumber].role = 'sub2'
	}
	customerRoleDildo(sender)
	ChatRoomCharacterUpdate(sender)
}

function checkRoomForCustomer() {
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (!(ChatRoomCharacter[D].MemberNumber in customerList)) {
      newCustomer(ChatRoomCharacter[D])
      console.log("Added " + ChatRoomCharacter[D].Name + " as customer.")
    }
  }
}

function dollLock(sender) {
  var assetLock = AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")
  InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: assetLock})
  InventoryGet(sender, "ItemArms").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
  InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: assetLock})
  InventoryGet(sender, "ItemHead").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
  InventoryLock(sender, InventoryGet(sender, "ItemMouth3"), { Asset: assetLock})
  InventoryGet(sender, "ItemMouth3").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
}

function promoteToDom2(sender) {
  if (!isNaN(sender)) {
    targetMemberNumber = sender
  } else {
    targetMemberNumber = sender.MemberNumber
  }
  customerList[targetMemberNumber].role = "dom2"
}

function buyPunishment(SenderCharacter, targetCharacter) {
  ServerSend("ChatRoomChat", { Content: "Oh " + targetCharacter.Name + ", seems that "+SenderCharacter.Name+" would really enjoy to see you in our puishment outfit. And since she is a paying customer... Let her enjoy your struggles.", Type: "Chat"} );
  dressLike(targetCharacter.MemberNumber,"doll", update = false)
  dollLock(targetCharacter)
  customerRoleDildo(targetCharacter, force = true)
  ChatRoomCharacterUpdate(targetCharacter)
  customerList[targetCharacter.MemberNumber].beingPunished = true
  ServerSend("ChatRoomChat", { Content: "You will now stay like this for a while. Try resisting a couple of orgasms and I may decide to free you again.", Type: "Chat", Target: targetCharacter.MemberNumber} );
}

function adulationCheck(targetMemberNumber) {
  if ("adulation" in customerList[targetMemberNumber].orderDict) {
    delete customerList[targetMemberNumber].orderDict["adulation"]
    ServerSend("ChatRoomChat", { Content: "(Private) I asked you something extremely easy and you were not able to do it. This is one strike for you.", Type: "Chat", Target: targetMemberNumber} );
    customerList[targetMemberNumber].strike = customerList[targetMemberNumber].strike + 1
    if (customerList[targetMemberNumber].strike >= 3) {
      ServerSend("ChatRoomChat", { Content: "(Private) 3 strikes, you need to be punished now.", Type: "Chat", Target: targetMemberNumber} );
      for (R = 0; R < ChatRoomCharacter.length; R++) {
        if (ChatRoomCharacter[R].MemberNumber == targetMemberNumber) {
          givePunishment(ChatRoomCharacter[R])
        }
      }
    }
  }
}
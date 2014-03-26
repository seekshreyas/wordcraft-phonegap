
				/*	
					$( "#init-words" ).children().each(function(index,value){
						
						console.log("Data",index,value);
						console.log("Priting data inside this: " + value.id);

						var pos = ui.item[0].id;
						console.log(S(pos).substring(0,pos.length-2).s);

						if(S(pos).substring(0,pos.length-2).s === "noun")
						{
							console.log("Looping: "+ S(value.id).substring(0,value.id.length-2));

							if (S(value.id).substring(0,value.id.length-2) === "noun")
							{
								console.log("Inside noun disable sortable");

								$("#"+value.id).sortable( "option", "disabled", true );
								//value.removeClass("draggable");
								//value.toggleClass("undraggable");
								//$(this).removeClass('connectedSortable');
							}
							else
							{
								console.log("Inside verb disable sortable");

								$("#"+value.id).remove();
								//value.removeClass("draggable");
								//value.toggleClass("undraggable");
							}

						}
						else if(S(pos).substring(0,pos.length-2).s === "verb")
						{
							if (S(value.id).substring(0,value.id,length-2) === "verb")
							{
								$(this).removeClass('connectedSortable');
							}

						} 


						$(this).removeClass("draggable");
						$(this).toggleClass("undraggable");

						console.log(value.className);

					}); */

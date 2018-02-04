{
    // 获取固定DOM
    const DOM = {
        chatlead: $(".chat-lead"),
        chatip: $(".chat-tip")
    }

    var main = () => {
        // 判断是否设置昵称等信息
        if( localStorage.getItem("username") ){
            var socket = io();
            $(".chat-control").submit(() => {
                socket.emit('chat message',{
                    msg: $("#user-content").val(),
                    username: localStorage.getItem('username'),
                    useravatar: localStorage.getItem('useravatar'),
                    sendTime: new Date()
                });
                $("#user-content").val('');
                return false;
            });
            socket.on('chat message', (msg) => {
                $(".chat-content .content-list").append(
                    `<li>
                        <p class="list-info">
                            <img src="${msg.useravatar}">
                            <span>${msg.username}</span>
                            <span class="info-time">${msg.sendTime}</span>
                        </p>
                        <p class="list-con">${msg.msg}</p>
                    </li>`
                );
                var h = $(".content-list").height();
                console.log(h);
                $(".chat-content").scrollTop(h); 
            })
        } else {
            DOM.chatlead.show();
            enterFuc();
        }
    }

    function enterFuc () {
        // 引导界面提交处理函数
        $(".lead-control").on('submit', () => {
            var username = $("#user-name").val();
            var useravatar = $(".user-avatarselect:checked").val();
            if( username ){
                localStorage.setItem('username', username);
                localStorage.setItem('useravatar', useravatar);
                DOM.chatlead.hide();
                joinMes();
            } else {
                alert('昵称或形象不能为空');
            }
            return false;
        })
    }

    function joinMes () {
        DOM.chatip.append(`<p class="tip-des">明星 <span>${localStorage.getItem("username")}</span> 加入了聊天室 </a>`);

    }

    main();

}


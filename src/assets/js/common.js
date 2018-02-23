{
    // 获取固定DOM
    const DOM = {
        chatlead: $(".chat-lead"),
        chatip: $(".chat-tip"),
        onlinePeopleButton: $("#online-people"),
        mainContentArea:  $(".chat-content .content-list"),
        onlinePeopleFloatBox: $(".online-people-flbox"),
        onlinePeopleFloatBoxList: $(".online-people-flbox .online-list")
    }

    // 工具函数
    const UTILS = (function(){
        let scrollBottom = () => {
            // 滚动到底部
            let h = $(".content-list").height();
            $(".chat-content").scrollTop(h); 
        }
        return {
            scrollBottom: scrollBottom,
        }
    })();

    var socket = io();
    var username,useravatar;

    var main = () => {
        // 显示引导
        DOM.chatlead.show();
        enterFuc();
        // 发送消息
        $(".chat-control").submit(() => {
            socket.emit('chat message',{
                msg: $("#user-content").val(),
                username: username,
                useravatar: useravatar,
                sendTime: new Date()
            });
            $("#user-content").val('');
            return false;
        });
        // 监听发送消息
        socket.on('chat message', (msg) => {
            DOM.mainContentArea.append(
                `<li>
                    <p class="list-info">
                        <img src="${msg.useravatar}">
                        <span>${msg.username}</span>
                        <span class="info-time">${msg.sendTime}</span>
                    </p>
                    <p class="list-con">${msg.msg}</p>
                </li>`
            );
            UTILS.scrollBottom();
        });
        showOnline();
    }

    function enterFuc () {
        // 引导界面提交处理函数
        $(".lead-control").on('submit', () => {
            username = $("#user-name").val();
            useravatar = $(".user-avatarselect:checked").val();
            if( username ){
                addUser(username,useravatar);
            } else {
                alert('昵称或形象不能为空');
            }
            return false;
        })
    }

    function addUser (username,useravatar) {
        // 添加用户函数
        socket.emit('addUser', {
            username: username,
            useravatar: useravatar
        });
    }

    // 监听添加成功消息
    socket.on('addUser success', (msg) => {
        DOM.chatlead.hide();
    });

    // 监听添加失败消息
    socket.on('addUser error', (msg) => {
        alert("已有同名用户")
    })
    
    var ifs = true;

    // 显示在线用户
    function showOnline () {
        DOM.onlinePeopleButton.on('click', () => {
            showOnlineFloatBox();
            socket.emit('show online');
        });
        socket.on('show online', (msg) => {
            DOM.onlinePeopleFloatBoxList.empty();
            for(let j=0; j<msg.length; j++){
                DOM.onlinePeopleFloatBoxList.append(
                    `<li><img src="${msg[j].useravatar}" alt="avatar"/>${msg[j].username}</li>`
                )
            } 
        });
    }

    // 在线用户浮窗层
    function showOnlineFloatBox () {
        if(ifs){
            DOM.onlinePeopleFloatBox.animate({
                left: 0
            }, 500, 'ease-out');
            ifs = false;
        }else{
            DOM.onlinePeopleFloatBox.animate({
                left: '101%'
            }, 500, 'ease-out');
            ifs = true;
        }
    }

    main();

}


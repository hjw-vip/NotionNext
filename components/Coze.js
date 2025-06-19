import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Coze-AI机器人
 * @returns
 */
export default function Coze() {
  const cozeSrc = siteConfig(
    'COZE_SRC_URL',
    'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/0.1.0-beta.6/libs/cn/index.js'
  )
  const title = siteConfig('COZE_TITLE', 'NotionNext助手')
  const botId = siteConfig('COZE_BOT_ID')
  const token = siteConfig('COZE_PAT_TOKEN')

  const loadCoze = async () => {
    await loadExternalResource(cozeSrc)
    const CozeWebSDK = window?.CozeWebSDK
    if (CozeWebSDK) {
      const cozeClient = new CozeWebSDK.WebChatClient({
        config: {
          type: 'bot',
          bot_id: botId,
          isIframe: false,
        },
        auth: {
          type: 'token',
          token: token,
          onRefreshToken: async () => token
        },
        userInfo: {
          id: 'user',
          url: siteConfig('COZE_USER_AVATAR', 'https://lf-coze-web-cdn.coze.cn/obj/eden-cn/lm-lgvj/ljhwZthlaukjlkulzlp/coze/coze-logo.png'),
          nickname: siteConfig('COZE_USER_NICKNAME', 'User'),
        },
        ui: {
          base: {
            icon: siteConfig('COZE_ICON', 'https://lf-coze-web-cdn.coze.cn/obj/eden-cn/lm-lgvj/ljhwZthlaukjlkulzlp/coze/chatsdk-logo.png'),
            layout: 'pc',
            lang: siteConfig('COZE_LANG', 'zh-CN'),
            zIndex: 1000
          },
          header: {
            isShow: true,
            isNeedClose: true,
          },
          asstBtn: {
            isNeed: true
          },
          footer: {
            isShow: true,
            expressionText: siteConfig('COZE_FOOTER_TEXT', 'Powered by NotionNext'),
          },
          chatBot: {
            title: title,
            uploadable: true,
            width: 390,
          },
        }
      })
      console.log('coze', cozeClient)
    }
  }

  useEffect(() => {
    if (!botId || !token) {
      return
    }
    loadCoze()
  }, [])
  return <></>
}

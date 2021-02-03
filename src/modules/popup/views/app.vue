<template>
  <div class="popup">
    <div class="popup__main">
      <Form
        ref="popupFormRef"
        :model="popupForm"
        :rules="popupRules"
        layout="horizontal"
        hideRequiredMark
        labelAlign="right"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <FormItem label="源网站" name="fromUrl">
          <Input
            v-model:value="popupForm.fromUrl"
            :disabled="popupForm.sync"
            allow-clear
            placeholder="例：https://www.google.com/"
            class="popup__url-input"
          ></Input>
          <Tooltip placement="bottomLeft" :defaultVisible="false">
            <template #title>点击设置当前页面url为源网站</template>
            <Button class="popup__url-set" shape="circle" :disabled="popupForm.sync" @click="setCurrentUrl('from')">
              <template #icon>
                <AimOutlined />
              </template>
            </Button>
          </Tooltip>
        </FormItem>
        <FormItem label="目标网站" name="toUrl">
          <Input
            v-model:value="popupForm.toUrl"
            :disabled="popupForm.sync"
            allow-clear
            placeholder="例：https://www.google.com/"
            class="popup__url-input"
          ></Input>
          <Tooltip placement="bottomLeft" :defaultVisible="false">
            <template #title>点击设置当前页面url为目标网站</template>
            <Button class="popup__url-set" shape="circle" :disabled="popupForm.sync" @click="setCurrentUrl('to')">
              <template #icon>
                <AimOutlined />
              </template>
            </Button>
          </Tooltip>
        </FormItem>
        <FormItem label="是否自动同步" name="sync">
          <Switch v-model:checked="popupForm.sync" @change="onChangeSync"></Switch>
        </FormItem>
        <FormItem :wrapperCol="{ span: 10, offset: 9 }">
          <Button class="popup__submit" type="primary" :disabled="popupForm.sync" @click="setHandler">
            一键设置cookie
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { Form, Input, Button, Switch, Tooltip, message } from 'ant-design-vue'
import { AimOutlined } from '@ant-design/icons-vue'
import { getWebDomain, getFormatUrl } from '@/lib/common'
import { PopupForm } from '@/types/popup'
import { Tab, Cookie } from '@/types/chrome-api'
import CONFIG from '@/lib/config'
import {
  getCurrentTab,
  permissionsContains,
  requestPermissions,
  getAllCookie,
  setCookie,
  setStorage,
  getStorage
} from '@/lib/chrome-api.ts'

export default {
  components: {
    Form,
    FormItem: Form.Item,
    Switch,
    Tooltip,
    AimOutlined,
    Input,
    Button
  },
  setup() {
    const popupFormRef = ref()
    const popupForm: PopupForm = reactive({
      fromUrl: '',
      toUrl: '',
      sync: false
    })
    const { STORAGE_KEY_NAMESPACE } = CONFIG
    // 设置同步存储中的配置
    getStorage().then(res => {
      if (res && Object.keys(res).length > 0) {
        popupForm.fromUrl = res[STORAGE_KEY_NAMESPACE]?.fromUrl || ''
        popupForm.toUrl = res[STORAGE_KEY_NAMESPACE]?.toUrl || ''
        popupForm.sync = res[STORAGE_KEY_NAMESPACE]?.sync || false
      }
    })
    const validateFromUrl = (rule: Array<string>, value: string, callback: (arg0?: Error | undefined) => void) => {
      if (!value) {
        callback(new Error('请输入源网站网址'))
        return
      }
      // if (!/^(((ht|f)tps?):\/\/)[\w-]+(\.[\w-]+)+\/\S*$/.test(value)) {
      if (!/^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(value)) {
        callback(new Error('网址格式不正确'))
        return
      }
      callback()
    }
    const validateToUrl = (rule: Array<string>, value: string, callback: (arg0?: Error | undefined) => void) => {
      if (!value) {
        callback(new Error('请输入目标网站网址'))
        return
      }
      if (
        !/^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(value) &&
        !value.includes('http://localhost:')
      ) {
        callback(new Error('网址格式不正确'))
        return
      }
      callback()
    }

    const popupRules = reactive({
      fromUrl: [
        { required: true, message: '请输入源网站网址' },
        { validator: validateFromUrl, trigger: 'blur' }
      ],
      toUrl: [
        { required: true, message: '请输入目标网站网址' },
        { validator: validateToUrl, trigger: 'blur' }
      ]
    })
    // 设置当前激活页面地址
    const setCurrentUrl = (type: 'from' | 'to' = 'to') => {
      // 设置toUrl初始值
      getCurrentTab((tabs: Tab) => {
        if (type === 'to') {
          popupForm.toUrl = tabs?.[0]?.url || ''
          return
        }
        if (type === 'from') {
          popupForm.fromUrl = tabs?.[0]?.url || ''
          return
        }
      })
    }
    // 查询权限 & 重新请求
    const retryPermissions = (source: string) => {
      return new Promise((resolve, reject) => {
        permissionsContains(source).then(hasSourcePermission => {
          if (hasSourcePermission) {
            return resolve(hasSourcePermission)
          }
          requestPermissions(source).then(isPass => {
            if (isPass) {
              return resolve(isPass)
            }
            console.log('操作不被允许，请授予权限')
            return reject()
          })
        })
      })
    }

    // 视图层复制cookie核心函数
    const copyCookieMain = () => {
      message.destroy()
      const fromUrl = getFormatUrl(popupForm.fromUrl)
      const toUrl = getFormatUrl(popupForm.toUrl)
      let cookie: Cookie = null
      // 验证来源地址权限
      retryPermissions(fromUrl)
        .then(async () => {
          cookie = await getAllCookie(fromUrl)
        })
        .then(() => {
          if (!cookie || !cookie.length) {
            message.warning('目标网站不存在cookie值')
            return
          }
          // 验证目标地址权限
          retryPermissions(toUrl)
            .then(() => {
              const allCookie = cookie.map((item: Cookie) => {
                return setCookie(toUrl, {
                  domain: getWebDomain(toUrl),
                  name: item.name,
                  value: item.value,
                  path: item.path,
                  expirationDate: item.expirationDate
                })
              })
              Promise.all(allCookie)
                .then(() => {
                  message.success('设置成功')
                  // 保存配置到用户storage中
                  setStorage(
                    {
                      fromUrl: popupForm.fromUrl,
                      toUrl: popupForm.toUrl,
                      sync: popupForm.sync
                    },
                    () => {
                      setTimeout(() => {
                        message.success('自动存储本次配置，成功')
                      }, 500)
                    }
                  )
                })
                .catch(err => {
                  console.log('setCookieError', err)
                  message.error('设置失败')
                })
            })
            .catch(err => {
              console.log('setCookieError', err)
              message.error('验证目标地址权限失败')
            })
        })
        .catch(err => {
          console.log('setCookieError', err)
          message.error('验证来源地址权限失败')
        })
    }

    // button click 设置
    const setHandler = () => {
      popupFormRef.value
        .validate()
        .then(() => {
          copyCookieMain()
        })
        .catch((err: string) => {
          console.log('validError', err)
        })
    }

    // 同步开关状态变更
    const onChangeSync = (val: boolean) => {
      if (val) {
        popupFormRef.value
          .validate()
          .then(() => {
            copyCookieMain()
          })
          .catch((err: string) => {
            popupForm.sync = false
            console.log('validError', err)
          })
      } else {
        setStorage({
          fromUrl: popupForm.fromUrl,
          toUrl: popupForm.toUrl,
          sync: val
        })
      }
    }

    return {
      popupForm,
      popupFormRef,
      popupRules,
      setCurrentUrl,
      onChangeSync,
      setHandler
    }
  }
}
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  font-family: 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, 微软雅黑, Arial, sans-serif';
}
.popup {
  &__main {
    width: 576px;
    padding: 35px 20px 10px;
    color: #333;
    box-shadow: 0 0 10px rgba(211, 226, 235, 5);
  }
  &__url-input {
    width: 90%;
  }
  &__url-set {
    margin-left: 5px;
    border: 0;
  }
  &__submit {
    margin: 0 auto;
  }
}
</style>

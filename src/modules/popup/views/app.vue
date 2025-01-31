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
        <Form.Item :label="t('form.label.source')" name="fromUrl">
          <Input
            v-model:value="popupForm.fromUrl"
            :disabled="popupForm.sync"
            allow-clear
            :placeholder="t('form.url.placeholder')"
            class="popup__url-input"
            @update:value="onUrlChange"
          ></Input>
          <Tooltip placement="bottomLeft" :defaultVisible="false">
            <template #title>{{ t('tooltip.setCurrentAsSource') }}</template>
            <Button
              class="popup__url-set"
              shape="circle"
              :disabled="popupForm.sync"
              @click="setCurrentUrl('from')"
            >
              <template #icon>
                <AimOutlined />
              </template>
            </Button>
          </Tooltip>
        </Form.Item>
        <Form.Item :label="t('form.label.target')" name="toUrl">
          <Input
            v-model:value="popupForm.toUrl"
            :disabled="popupForm.sync"
            allow-clear
            :placeholder="t('form.url.placeholder')"
            class="popup__url-input"
            @blur="onUrlChange"
          ></Input>
          <Tooltip placement="bottomLeft" :defaultVisible="false">
            <template #title>{{ t('tooltip.setCurrentAsTarget') }}</template>
            <Button
              class="popup__url-set"
              shape="circle"
              :disabled="popupForm.sync"
              @click="setCurrentUrl('to')"
            >
              <template #icon>
                <AimOutlined />
              </template>
            </Button>
          </Tooltip>
        </Form.Item>
        <Form.Item :label="t('form.label.autoSync')" name="sync">
          <Switch
            v-model:checked="popupForm.sync"
            @change="onChangeSync"
          ></Switch>
        </Form.Item>
        <Form.Item :wrapperCol="{ span: 10, offset: 9 }">
          <Button
            class="popup__submit"
            type="primary"
            :disabled="popupForm.sync"
            @click="setHandler"
          >
            {{ t('form.button.setCookie') }}
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { Form, Input, Button, Switch, Tooltip, message } from "ant-design-vue";
import { AimOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useCookieSync } from '@/hooks/useCookieSync';
import { useUrlValidation } from '@/hooks/useUrlValidation';
import { getCurrentTab, setStorage, getStorage } from "@/utils/chrome-api";
import type { PopupForm } from "@/types/popup";
import type { Tab } from "@/types/chrome-api";
import CONFIG from "@/config";

const { t } = useI18n();
const { copyCookie } = useCookieSync();
const { validateFromUrl, validateToUrl } = useUrlValidation();

const popupFormRef = ref();
const popupForm: PopupForm = reactive({
  fromUrl: "",
  toUrl: "",
  sync: false,
});

// 设置同步存储中的配置
getStorage().then((res) => {
  if (res && Object.keys(res).length > 0) {
    popupForm.fromUrl = res[CONFIG.STORAGE_KEY_NAMESPACE]?.fromUrl || "";
    popupForm.toUrl = res[CONFIG.STORAGE_KEY_NAMESPACE]?.toUrl || "";
    popupForm.sync = res[CONFIG.STORAGE_KEY_NAMESPACE]?.sync || false;
  }
});

const popupRules = reactive({
  fromUrl: [{ validator: validateFromUrl, trigger: "blur" }],
  toUrl: [{ 
    validator: (rule: Array<string>, value: string, callback: (error?: Error) => void) => {
      validateToUrl(rule, value, callback, popupForm.fromUrl);
    }, 
    trigger: "blur" 
  }],
});

// 设置当前激活页面地址
const setCurrentUrl = (type: "from" | "to" = "to") => {
  getCurrentTab().then((tabs: Tab) => {
    popupForm[`${type}Url`] = tabs?.[0]?.url || "";
    onUrlChange();
  });
};

// 输入框变更保存输入值
const onUrlChange = () => {
  setStorage({
    fromUrl: popupForm.fromUrl,
    toUrl: popupForm.toUrl,
    sync: popupForm.sync,
  });
};

// button click 设置
const setHandler = () => {
  popupFormRef.value
    .validate()
    .then(() => {
      copyCookie(popupForm.fromUrl, popupForm.toUrl);
    })
    .catch((err: string) => {
      console.log("validError", err);
    });
};

// 同步开关状态变更
const onChangeSync = (val: unknown) => {
  popupFormRef.value
    .validate()
    .then(() => {
      setStorage({
        fromUrl: popupForm.fromUrl,
        toUrl: popupForm.toUrl,
        sync: val as boolean,
      });
    })
    .catch((err: string) => {
      popupForm.sync = false;
      message.error('设置失败');
    });
};
</script>

<style lang="scss">
html,
body {
  width: fit-content;
  height: fit-content;
}
#app {
  width: fit-content;
  height: fit-content;
}
* {
  padding: 0;
  margin: 0;
  font-family: "Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, 微软雅黑, Arial, sans-serif";
}
.popup {
  &__main {
    width: 576px;
    padding: 45px 20px 10px;
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

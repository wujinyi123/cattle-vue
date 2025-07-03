<template>
  <div style="display: inline-block;margin-left: 10px;">
    <el-button type="primary" icon="el-icon-download" @click="exportFile">导出</el-button>
    <el-button type="primary" icon="el-icon-upload2" @click="importDialogVisible = true" v-if="hasImport">导入</el-button>
    <el-dialog :destroy-on-close="true" title="批量导入" :visible.sync="importDialogVisible">
      <div>
        <span style="margin-right: 10px;">请使用模板导入，模板为xlsx文件</span>
        <el-button type="primary" icon="el-icon-download">下载模板</el-button>
      </div>
      <div style="font-size: 15px;margin-bottom: 20px">
        <p style="color: red">注意：</p>
        <p>&nbsp;&nbsp;<span>1、请不要修改模板格式</span></p>
        <p>&nbsp;&nbsp;<span>2、请把数据放至第一个sheet页</span></p>
        <p>&nbsp;&nbsp;<span>3、模板中必填信息有：</span><span>{{ requireFields }}</span></p>
      </div>
      <el-upload
          style="text-align: center"
          class="upload-demo"
          drag
          :action="importAction"
          :headers="headers"
          :show-file-list="false"
          :before-upload="uploadBefore"
          :on-success="uploadSuccess"
          :on-error="uploadError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {importRequireField} from '@/api/common';
import currentUser from "@/utils/currentUser";

export default {
  name: 'ImportExport',
  props: {
    templateCode: {
      type: String,
      default: 'NA'
    },
    hasImport: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      requireFields: '',
      importAction: '',
      headers: {},
      importDialogVisible: false
    };
  },
  created() {
    this.importAction = `/api/common/importFile?templateCode=${this.templateCode}`;
    this.headers = {token: currentUser.getToken()}
    importRequireField(this.templateCode).then(res => this.requireFields = res.join(','));
  },
  methods: {
    exportFile() {

    },
    uploadBefore(file) {
      if (!file.name.endsWith('.xlsx')) {
        this.$message.error('请上传xlsx文件');
        return false;
      }
      return true;
    },
    uploadSuccess(response, file) {
      this.$message.success(`成功导入：${file.name}`);
      console.log(response);
    },
    uploadError(err) {
      let obj = typeof (err) == 'string' ? JSON.parse(err) : err;
      this.$message.error(obj.body || '系统异常');
    }
  }
};
</script>

<style scoped>

</style>

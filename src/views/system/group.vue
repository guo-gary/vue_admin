<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" :clear="resetForm" />
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
        :delFunc="handleDelete" :changePage="changePage" :editFunc="handleEdit" :refresh="refreshTable"
        :current-page="page.index" :page-size="page.size" rowKey="groupId" tableKey="deleteSelect"
        :delSelection="delSelection">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
          <el-button type="primary" :icon="Search" @click="visibleFind = true">多条件查询</el-button>
        </template>
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
        <template #permissions="{ rows }">
          <el-button type="primary" size="small" plain @click="handlePermission(rows)">管理</el-button>
        </template>
      </TableCustom>
    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
      :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :formData="rowData" :options="isEdit ? options : optionsAdd" :edit="isEdit" :update="updateData"
        :add="addGroup" />
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #isDeleted="{ rows }">
                    <el-tag type="success" v-if="rows.isDeleted===0">未删除</el-tag>
                    <el-tag type="danger" v-else>已删除</el-tag>
                </template>
      </TableDetail>
    </el-dialog>
 <!-- 多条件查询弹窗组件 -->
 <el-dialog title="查询条件" v-model="visibleFind" width="30%">
            <el-form :model="query" ref="formAddRef">
                <el-form-item label="分组ID" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.groupId" placeholder="请输入分组ID"></el-input>
                </el-form-item>
                <el-form-item label="分组名称" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.groupName" placeholder="请输入分组名称"></el-input>
                </el-form-item>
                <el-form-item label="是否删除" :label-width="formLabelWidth">
                    <el-select v-model="query.isDeleted" placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未删除" value="0"></el-option>
                        <el-option label="已删除" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 其他字段表单项... -->
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetForm()">清空</el-button>
                    <el-button type="primary" @click="handleFind()">
                        查询
                    </el-button>
                </div>
            </template>
        </el-dialog>
  </div>
</template>

<script setup lang="ts" name="group">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Request_group, Response_group, Record, Request_group_delete } from '@/types/group';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import { CirclePlusFilled ,Search} from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import { deleteGroupAPI, getGroupAPI, addGroupAPI, updateGroupAPI } from '@/api/group';
const formLabelWidth = '100px';
const visibleFind = ref(false);
// 获取localStorage中的'selectedCircle'项
const selectedCircleStorage = localStorage.getItem('selectedCircle');
const selectedCircle = JSON.parse(selectedCircleStorage);

// 查询相关
const query: Request_group = reactive({
  groupName: '',
  groupId: '',
  p: '1',
  s: '10',
  isDelete: "",
  circleId: selectedCircle.circleId,
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '分组ID：', prop: 'groupId' },
  { type: 'input', label: '分组名称：', prop: 'groupName' }
]);

const handleSearch = () => {
  handGetOneGroup();
};
const handGetOneGroup = async () => {
  console.log(query.groupId);
  console.log(query.groupName);
  if (query.groupId === '' && query.groupName === '') {
    getGroups();
    return;
  }
  const res = await getGroupAPI(query);
  const { records, total } = res;
  // resetForm();
  tableData.value = records;
  page.total = total;
}

// 表格相关
let columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'groupId', label: '分组ID' },
  { prop: 'circleId', label: '圈子ID' },
  { prop: 'groupName', label: '分组名称' },
  { prop: 'isDeleted', label: '是否删除' },
  { prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const tableData = ref<Record[]>([]);

const changePage = (val: number) => {
  page.index = val;
  getGroups();
};

// 新增/编辑弹窗相关
const optionsAdd = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    { type: 'input', label: '圈子ID', prop: 'circleId', required: true },
    { type: 'input', label: '分组名称', prop: 'groupName', required: true },
  ]
});
const options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    // { type: 'input', label: '圈子ID', prop: 'circleId', required: true },
    { type: 'input', label: '分组名称', prop: 'groupName', required: true },
  ]
});
const visible = ref(false);
const isEdit = ref(false);
const rowData: Request_group_update = ref({});
const handleEdit = async (row: Request_group_update) => {
  try {
    // const res = await getOneGroup(row.groupId);
    isEdit.value = true;
    visible.value = true;
    rowData.value = { ...row };
  } catch (error) {
    console.error(error);
  }
};
const updateData = async (data) => {
  updateGroup(data);
  closeDialog();
};
const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
  rowData.value = {};
};
const updateGroup = async (data) => {
  try {
    const res = await updateGroupAPI(data);
    if (res.code === 1) {
      ElMessage.success('修改成功');
      visible.value = false;
      isEdit.value = false;
      rowData.value = {};
      getGroups();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('修改失败');
  }
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
  column: 1
});
const handleView = async (row: Request_group) => {
  try {
    // const res = await getOneGroup(row.groupId);
    viewData.value.row = { ...row };
    viewData.value.list = [
      {
        prop: 'groupId',
        label: '分组ID',
      },
      {
        prop: 'circleId',
        label: '圈子ID',
      },
      {
        prop: 'groupName',
        label: '分组名称',
      },
      {
        prop: 'isDeleted',
        label: '是否删除',
      },
    ];
    visible1.value = true;
  } catch (error) {
    console.error(error);
  }
};

// 删除相关
const handleDelete = async (row: Request_group_delete) => {
  selectedGroups.ids = row.groupId
  try {
    const res = await deleteGroupAPI(selectedGroups);
    if (res.code === 1) {
      ElMessage.success('删除成功');
      getGroups();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('删除失败');
  }
};
// 删除相关
const selectedGroups = reactive({
  ids: [],
});
const delSelection = async (data: []) => {
  try {
    const normalArray = Array.from(data);
    console.log(normalArray)
    selectedGroups.ids = normalArray
    const response = await deleteGroupAPI(selectedGroups);
    if (response.code === 1) {
      ElMessage.success('分组删除成功');
      getGroups();
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('服务器错误，请稍后再试');
  }
};
// 权限管理弹窗相关
const visible2 = ref(false);
const permissOptions = ref({});
const handlePermission = (row) => {
  visible2.value = true;
  permissOptions.value = {
    id: row.groupId
  };
}

// const request: Request_group = reactive({
//   p: '1',
//   s: '10',
//   groupId: "",
//   groupName: "",
//   isDelete: "",
//   circleId: selectedCircle.circleId
// });

const resetForm = () => {
  query.groupId = null;
  query.groupName = '';
  query.isDeleted = '';
}
const getGroups = async () => {
  query.p = page.index + '';
  try {
    const res = await getGroupAPI(query);
    const { records, total } = res;
    tableData.value = records;
    page.total = total;
    visibleFind.value=false;
  } catch (error) {
    console.log(error)
  }
}
getGroups();
const handleFind = () => {
    page.index = 1;
    getGroups();
}
// 回调，获取单个分组信息
//   const getOneGroup = async (data) => {
//     try {
//       const res = await getOneGroupAPI(data);
//       if (res.code == 1) {
//         console.log(res.data);
//         return res.data;
//       } else {
//         ElMessage.error(res.msg);
//       }
//     } catch (error) {
//       ElMessage.error(error);
//     }
//   };

// 定义刷新方法
const refreshTable = () => {
  handGetOneGroup();
};

// 新增分组
const addGroup = async (form_add) => {
  try {
    const res = await addGroupAPI(form_add);
    if (res.code == 1) {
      ElMessage.success('新增成功');
      getGroups();
      visible.value=false;
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('新增失败');
  }
}
</script>

<style scoped></style>
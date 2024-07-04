<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" :clear="resetForm"/>
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :changePage="changePage" :editFunc="handleEdit" :refresh="refreshTable"
                :current-page="page.index" :page-size="page.size" rowKey="topicId">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visibleAdd = true">新增</el-button>
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
            <TableEdit :formData="rowData" :options="options" :edit="isEdit" :update="updateData" :add="addTopic" />
        </el-dialog>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visibleAdd" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :formData="rowData" :options="optionsAdd" :edit="isEdit" :update="updateData" :add="addTopic" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData">
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </TableDetail>
        </el-dialog>
  <!-- 多条件查询弹窗组件 -->
  <el-dialog title="查询条件" v-model="visibleFind" width="30%">
      <el-form :model="query" ref="formAddRef">
        <el-form-item label="话题ID" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.topicId" placeholder="请输入话题ID"></el-input>
        </el-form-item>
        <el-form-item label="话题名称" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.topicName" placeholder="请输入话题名称"></el-input>
        </el-form-item>
        <el-form-item label="分组ID" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.groupId" placeholder="请输入分组ID"></el-input>
        </el-form-item>
        <el-form-item label="分组名称" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.groupName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
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

<script setup lang="ts" name="topic">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Request_topic, Response_topic, Data, Record, Request_topic_add, Request_topic_update, Request_topic_delete } from '@/types/topic';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import { CirclePlusFilled ,Search} from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import { deleteTopicAPI, getTopicAPI, addTopicAPI, updateTopicAPI } from '@/api/topic';
import { ta } from 'element-plus/es/locale';
const formLabelWidth = '100px';
const visibleFind = ref(false);
// 获取localStorage中的'selectedCircle'项
const selectedCircleStorage = localStorage.getItem('selectedCircle');
const selectedCircle = JSON.parse(selectedCircleStorage);
// 查询相关
const query: Request_topic = reactive({
    topicId: '',
    topicName: '',
    p: 1,
    s: 10,
    circleId: selectedCircle.circleId
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '话题ID：', prop: 'topicId' },
    { type: 'input', label: '话题名称：', prop: 'topicName' }
]);

const handleSearch = () => {
    handGetOneTopic();
};
const handGetOneTopic = async () => {
    console.log(query.topicId);
    console.log(query.topicName);
    if (query.topicId === '' && query.topicName === '') {
        getTopics();
        return;
    }
    const res = await getTopicAPI(query);
    if (res.code === 1) {
        const { records, total } = res.data;
        tableData.value = records;
        console.log(tableData.value);
        page.total = total;
    } else {
        ElMessage.error(res.msg)
    }
    // if (!res) {
    //   ElMessage.error('话题不存在');
    //   return;
    // }
    // tableData.value = res.data.record;
    // page.total = 1;
}

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'topicId', label: '话题ID' },
    { prop: 'topicName', label: '话题名称' },
    { prop: 'topicPostCount', label: '话题帖子数' },
    { prop: 'circleId', label: '圈子ID' },
    { prop: 'groupId', label: '分组ID' },
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
    getTopics();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
    labelWidth: '100px',
    span: 24,
    list: [
        { type: 'input', label: '分组ID', prop: 'groupId', required: true },
        { type: 'input', label: '话题名称', prop: 'topicName', required: true },
    ]
});
const optionsAdd = ref<FormOption>({
    labelWidth: '100px',
    span: 24,
    list: [
        { type: 'input', label: '圈子ID', prop: 'circleId', required: true },
        { type: 'input', label: '分组ID', prop: 'groupId', required: true },
        { type: 'input', label: '话题名称', prop: 'topicName', required: true },
    ]
});
const visible = ref(false);
const visibleAdd = ref(false);
const isEdit = ref(false);
const rowData: Request_topic_update = ref({});
const handleEdit = async (row: Request_topic_update) => {
    try {
        // const res = await getOneTopic(row.topicId);
        isEdit.value = true;
        visible.value = true;
        rowData.value = { ...row };
    } catch (error) {
        console.error(error);
    }
};
const updateData = async (data) => {
    updateTopic(data);
    closeDialog();
};
const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
    rowData.value = {};
};
const updateTopic = async (data) => {
    try {
        const res = await updateTopicAPI(data);
        if (res.code === 1) {
            ElMessage.success('修改成功');
            visible.value = false;
            isEdit.value = false;
            rowData.value = {};
            getTopics();
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
const handleView = async (row: Request_topic) => {
    try {
        // const res = await getOneTopic(row.topicId);
        viewData.value.row = { ...row };
        viewData.value.list = [
            {
                prop: 'topicId',
                label: '话题ID',
            },
            {
                prop: 'topicName',
                label: '话题名称',
            },
            {
                prop: 'topicPostCount',
                label: '话题帖子数',
            },
            {
                prop: 'circleId',
                label: '圈子ID',
            },
            {
                prop: 'groupId',
                label: '分组ID',
            },
        ];
        visible1.value = true;
    } catch (error) {
        console.error(error);
    }
};

// 删除相关
const handleDelete = async (row: Request_topic_delete) => {
    try {
        const res = await deleteTopicAPI(row);
        if (res.code === 1) {
            ElMessage.success('删除成功');
            getTopics();
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('删除失败');
    }
};

// 权限管理弹窗相关
const visible2 = ref(false);
const permissOptions = ref({});
const handlePermission = (row) => {
    visible2.value = true;
    permissOptions.value = {
        id: row.topicId
    };
}


// const request: Request_topic = reactive({
//     p: 1,
//     s: 10,
//     topicName: "",
//     circleId: selectedCircle.circleId
// });

const resetForm = () => {
    query.groupId = null;
    query.groupName = '';
    query.topicName = '';
    query.topicId = null;
}
const getTopics = async () => {
    query.p = page.index;
    try {
        const res = await getTopicAPI(query);
        if (res.code === 1) {
            const { records, total } = res.data;
            tableData.value = records;
            page.total = total;
            visibleFind.value = false;
        } else {
            ElMessage.error(res.msg)
        }
    } catch (error) {
        console.log(error)
    }
}
getTopics();
const handleFind = () => {
    page.index = 1;
    getTopics();
}
// 回调，获取单个话题信息
//   const getOneTopic = async (data) => {
//     try {
//       const res = await getOneTopicAPI(data);
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
    handGetOneTopic();
};

// 新增话题
const addTopic = async (form_add) => {
    try {
        const res = await addTopicAPI(form_add);
        if (res.code == 1) {
            ElMessage.success('新增成功');
            visibleAdd.value = false;
            getTopics();
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('新增失败');
    }
}
</script>

<style scoped></style>
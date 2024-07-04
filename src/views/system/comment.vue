<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" :clear="resetForm"/>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
        :delFunc="handleDelete" :changePage="changePage" :refresh="refreshTable" :current-page="page.index"
        :page-size="page.size" rowKey="commentId" tableKey="deleteSelect" :delSelection="delSelection">
        <template #toolbarBtn>
            <!-- <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button> -->
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
        <el-form-item label="评论ID" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.postCommentId" placeholder="请输入评论ID"></el-input>
        </el-form-item>
        <el-form-item label="评论内容" :label-width="formLabelWidth">
          <el-input class="custom-input" type="textarea" v-model="query.postComment" placeholder="请输入评论内容"></el-input>
        </el-form-item>
        <el-form-item label="帖子id" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.postId" placeholder="请输入帖子id"></el-input>
        </el-form-item>
        <el-form-item label="帖子标题" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.postTitle" placeholder="请输入帖子标题"></el-input>
        </el-form-item>
        <el-form-item label="分组ID" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.groupId" placeholder="请输入分组ID"></el-input>
        </el-form-item>
        <el-form-item label="分组名称" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.groupName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
        <el-form-item label="话题ID" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.topicId" placeholder="请输入话题ID"></el-input>
        </el-form-item>
        <el-form-item label="话题名称" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.topicName" placeholder="请输入话题名称"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input class="custom-input" v-model="query.userName" placeholder="请输入用户名称"></el-input>
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

<script setup lang="ts" name="comment">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Request_comment, Response_comment, Record } from '@/types/comment';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import { CirclePlusFilled,Search } from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import { deleteCommentAPI, getCommentAPI } from '@/api/comment';
const formLabelWidth = '100px';
const visibleFind = ref(false);
// 获取localStorage中的'selectedCircle'项
const selectedCircleStorage = localStorage.getItem('selectedCircle');
const selectedCircle = JSON.parse(selectedCircleStorage);
// 查询相关
const query: Request_comment = reactive({
  postCommentId: '',
  postTitle: '',
  p: '1',
  s: '10',
  circleId: selectedCircle.circleId,
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '评论ID：', prop: 'postCommentId' },
  // { type: 'input', label: '帖子标题：', prop: 'postTitle' },
  { type: 'input', label: '帖子ID：', prop: 'postId' },
]);

const handleSearch = () => {
  handGetOneComment();
};
const handGetOneComment = async () => {
  console.log(query.postCommentId);
  console.log(query.postTitle);
  // if (query.postCommentId === '' && query.postTitle === '') {
  //   getComments();
  //   return;
  // }
  const res = await getCommentAPI(query);
  const { records, total } = res;
  tableData.value = records;
  page.total = total;
}

// 表格相关
let columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'postCommentId', label: '评论ID' },
  { prop: 'commentContent', label: '评论内容' },
  { prop: 'commentLikeCount', label: '点赞数' },
  // { prop: 'replyCommentId', label: '回复评论ID' },
  { prop: 'postCommentCreateTime', label: '创建时间' },
  { prop: 'postId', label: '帖子ID' },
  { prop: 'userId', label: '用户ID' },
  { prop: 'operator', label: '操作', width: 300 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const tableData = ref<Record[]>([]);

const changePage = (val: number) => {
  page.index = val;
  getComments();
};

//   // 新增/编辑弹窗相关
//   const options = ref<FormOption>({
//     labelWidth: '100px',
//     span: 24,
//     list: [
//       { type: 'textarea', label: '评论内容', prop: 'commentContent', required: true },
//     ]
//   });
//   const visible = ref(false);
//   const isEdit = ref(false);
//   const rowData: Request_comment = ref({});
//   const handleEdit = async (row: Request_comment) => {
//     try {
//       // const res = await getOneComment(row.postCommentId);
//       isEdit.value = true;
//       visible.value = true;
//       rowData.value = {...row };
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const updateData = async (data) => {
//     updateComment(data);
//     closeDialog();
//   };
//   const closeDialog = () => {
//     visible.value = false;
//     isEdit.value = false;
//     rowData.value = {};
//   };
//   const updateComment = async (data) => {
//     try {
//       const res = await updateCommentAPI(data);
//       if (res.code === 1) {
//         ElMessage.success('修改成功');
//         visible.value = false;
//         isEdit.value = false;
//         rowData.value = {};
//         getComments();
//       } else {
//         ElMessage.error(res.msg);
//       }
//     } catch (error) {
//       ElMessage.error('修改失败');
//     }
//   };

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
  column: 1
});
const handleView = async (row: Request_comment) => {
  try {
    // const res = await getOneComment(row.postCommentId);
    viewData.value.row = { ...row };
    viewData.value.list = [
      {
        prop: 'postCommentId',
        label: '评论ID',
      },
      {
        prop: 'commentContent',
        label: '评论内容',
      },
      {
        prop: 'postCommentCreateTime',
        label: '创建时间',
      },
      {
        prop: 'postId',
        label: '帖子ID',
      },
      {
        prop: 'userId',
        label: '用户ID',
      },
    ];
    visible1.value = true;
  } catch (error) {
    console.error(error);
  }
};

// 删除相关
const handleDelete = async (row) => {
  selectedGroups.ids = row.postCommentId
  try {
    const res = await deleteCommentAPI(selectedGroups);
    if (res.code === 1) {
      ElMessage.success('删除成功');
      getComments();
    } else {
      ElMessage.error('删除失败');
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
    const response = await deleteCommentAPI(selectedGroups);
    if (response.code === 1) {
      ElMessage.success('分组删除成功');
      getComments();
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
    id: row.postCommentId
  };
}


// const request: Request_comment = reactive({
//   p: '1',
//   s: '10',
//   circleId: selectedCircle.circleId
// });

const resetForm = () => {
  query.groupId = null;
  query.groupName = '';
  query.postComment='';
  query.postCommentId=null;
  query.postId=null;
  query.postTitle='';
  query.topicId=null;
  query.topicName='';
  query.userId=null;
  query.userName='';
}
const getComments = async () => {
  query.p = page.index + '';
  try {
    const res = await getCommentAPI(query);

    const { records, total } = res;
    tableData.value = records;
    page.total = total;
    visibleFind.value = false;
  } catch (error) {
    console.log(error)
  }
}
getComments();
const handleFind = () => {
    page.index = 1;
    getComments();
}
// 回调，获取单个评论信息
//   const getOneComment = async (data) => {
//     try {
//       const res = await getOneCommentAPI(data);
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
  handGetOneComment();
};

// 新增评论
//   const addComment = async (form_add) => {
//     try {
//       const res = await addCommentAPI(form_add);
//       if (res.code == 1) {
//         ElMessage.success('新增成功');
//         getComments();
//       } else {
//         ElMessage.error(res.msg);
//       }
//     } catch (error) {
//       ElMessage.error('新增失败');
//     }
//   }
</script>

<style scoped></style>
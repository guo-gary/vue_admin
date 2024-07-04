<template>
    <div>
        <!-- <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <TableSearch :query="request" :options="searchOpt02" :search="handleSearch02" /> -->
        <div class="search-container">
            <el-form ref="searchRef" :model="query" :inline="true">
                <!-- <el-form-item :label="item.label" :prop="item.prop" v-for="item in options"> -->
                <!-- 文本框、下拉框、日期框 -->
                <!-- <el-input v-if="item.type === 'input'" v-model="query[item.prop]" :disabled="item.disabled"
					:placeholder="item.placeholder" clearable></el-input>
				<el-select v-else-if="item.type === 'select'" v-model="query[item.prop]" :disabled="item.disabled"
					:placeholder="item.placeholder" clearable>
					<el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
				</el-select>
				<el-date-picker v-else-if="item.type === 'date'" type="date" v-model="query[item.prop]"
					:value-format="item.format"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" :icon="Search" @click="search">搜索</el-button>
				<el-button :icon="Refresh" @click="resetForm(searchRef)">重置</el-button>
			</el-form-item> -->
                <el-form-item>
                    <div class="mt-4">
                        <el-input v-model="input3" style="max-width: 600px" placeholder="请输入"
                            class="input-with-select">
                            <template #prepend>
                                <el-select v-model="select" placeholder="回复内容" style="width: 115px">
                                    <el-option label="评论ID" value="id" />
                                    <el-option label="回复内容" value="replyContent" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="handleSearch" />
                            </template>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button :icon="Refresh" @click="resetForm02()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :changePage="changePage" :refresh="refreshTable" :current-page="page.index"
                :page-size="page.size" rowKey="postReplyId" tableKey="deleteSelect" :delSelection="delSelection">
                <!-- <template #toolbarBtn>
              <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
            </template> -->
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
                <template #permissions="{ rows }">
                    <el-button type="primary" size="small" plain @click="handlePermission(rows)">管理</el-button>
                </template>
            </TableCustom>
        </div>
        <!-- <el-dialog :title="isEdit? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
          :close-on-click-modal="false" @close="closeDialog">
          <TableEdit :formData="rowData" :options="options" :edit="isEdit" :update="updateData" :add="addComment" />
        </el-dialog> -->
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData">
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </TableDetail>
        </el-dialog>
        <el-dialog title="权限管理" v-model="visible2" width="500px" destroy-on-close>
            <!-- <RolePermission :permiss-options="permissOptions" /> -->
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="comment">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Request_by_id, Response_by_id, Record_by_id, Request_by_replyContent, Response_by_replyContent, Record_by_replyContent, Request_delete } from '@/types/replyComment';
import { getReplyAPI, getReplyByContentAPI, deleteReplyCommentAPI } from '@/api/replyComment';
import { FormOptionList } from '@/types/form-option';
import { Search, Refresh } from '@element-plus/icons-vue'
const input3 = ref('')
const select = ref('')
// 获取localStorage中的'selectedCircle'项
const selectedCircleStorage = localStorage.getItem('selectedCircle');
const selectedCircle = JSON.parse(selectedCircleStorage);
const signal = ref(false);
// 查询相关
const query = reactive({
    id: '',
    p: '1',
    s: '10',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '评论ID：', prop: 'id' },
    // { type: 'input', label: '回复内容：', prop: 'replyContent' },
]);
const searchOpt02 = ref<FormOptionList[]>([
    // { type: 'input', label: '帖子ID：', prop: 'postId' },
    { type: 'input', label: '回复内容：', prop: 'replyContent' },
]);
const handleSearch = () => {
    page.index = 1;
    if (select.value === 'id') {
        query.id = input3.value;
        getReplyCommentById();
    }
    else {
        request.replyContent = input3.value;
        getReplies();
    }
};
const getReplyCommentById = async () => {
    // console.log(query.postCommentId);
    // console.log(query.postTitle);
    // if (query.postCommentId === '' && query.postTitle === '') {
    //   getComments();
    //   return;
    // }
    signal.value = false;
    query.p = page.index + '';
    const res = await getReplyAPI(query);
    const { records, total } = res;
    tableData.value = records;
    page.total = total;
}

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'postReplyId', label: '回复ID' },
    { prop: 'postId', label: '帖子ID' },
    { prop: 'userId', label: '用户ID' },
    { prop: 'replyContent', label: '回复内容' },
    { prop: 'replyCommentId', label: '回复的评论ID' },
    { prop: 'createTime', label: '创建时间' },
    { prop: 'secReplyId', label: '回复目标ID' },
    { prop: 'replyUserId', label: '回复用户ID' },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref<Record[]>([]);

const changePage = (val: number) => {
    page.index = val;

    if (signal.value === true) {
        getReplies();
    }
    else {
        getReplyCommentById();
    }

};

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
    try {
        const res = await deleteReplyCommentAPI({ ids: row.postCommentId });
        if (res.code === 1) {
            ElMessage.success('删除成功');
            getReplies();
        } else {
            ElMessage.error('删除失败');
        }
    } catch (error) {
        ElMessage.error('删除失败');
    }
};

const selectedGroups = reactive({
    ids: [],
});
const delSelection = async (data: []) => {
    try {
        const normalArray = Array.from(data);
        console.log(normalArray);
        selectedGroups.ids = normalArray;
        const response = await deleteReplyCommentAPI(selectedGroups);
        if (response.code === 1) {
            ElMessage.success('分组删除成功');
            getReplies();
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

const request: Request_by_replyContent = reactive({
    p: '1',
    s: '10',
    replyContent: '',
});

const resetForm02 = () => {
    input3.value = '';
    request.replyContent = '';
    getReplies();
}
const getReplies = async () => {
    signal.value = true;
    request.p = page.index + '';
    try {
        const res = await getReplyByContentAPI(request);

        const { records, total } = res;
        tableData.value = records;
        page.total = total;
    } catch (error) {
        console.log(error)
    }
}
if (!localStorage.getItem('postCommentId')) {
    getReplies();
}
else {
    query.id = localStorage.getItem('postCommentId');
    getReplyCommentById();
    localStorage.removeItem('postCommentId');
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
    getReplies();
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

<style scoped>
.search-container {
    padding: 20px 30px 0;
    background-color: #fff;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}
</style>
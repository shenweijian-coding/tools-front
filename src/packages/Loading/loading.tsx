import { defineComponent, ref } from "vue";
import "./index.less";

export default defineComponent({
  name: "HayLoading",
  setup() {
    const title = ref("");
    const setTitle = (newTitle: string) => {
      title.value = newTitle;
    };

    return { title, setTitle };
  },
  render() {
    return <div class="hay-loading-mask">
      <div class="hay-loading-spinner">
        <i class="hay-icon-loading"></i>
        <p class="hay-loading-text">资源搜索中，请耐心等待！</p>
      </div>
    </div>;
  },
});

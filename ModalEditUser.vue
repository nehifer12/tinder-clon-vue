<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Editar Perfil</h3>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>

      <div class="modal-body">
        <label>Nombre</label>
        <input v-model="editableUser.name" type="text" />

        <label>Edad</label>
        <input v-model.number="editableUser.age" type="number" min="16" />

        <label>Ciudad</label>
        <input v-model="editableUser.city" type="text" />

        <label>Intereses</label>
        <textarea v-model="interestsText" placeholder="Separados por coma..."></textarea>
      </div>

      <div class="modal-footer">
        <button @click="saveChanges" class="btn-save">Guardar</button>
        <button @click="$emit('close')" class="btn-close">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalEditUser",
  props: {
    show: Boolean,
    user: Object,
  },
  data() {
    return {
      editableUser: { ...this.user },
      interestsText: this.user?.interests?.map(i => i.name).join(", ") || ""
    };
  },
  watch: {
    user(newVal) {
      this.editableUser = { ...newVal };
      this.interestsText = newVal?.interests?.map(i => i.name).join(", ") || "";
    }
  },
  methods: {
    saveChanges() {
      const updatedUser = {
        ...this.editableUser,
        interests: this.interestsText.split(",").map(i => ({ name: i.trim() }))
      };
      this.$emit("save", updatedUser);
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  background: #fff;
  width: 400px;
  border-radius: 12px;
  padding: 20px;
}
.modal-body {
  display: flex;
  flex-direction: column;
}
.modal-body label {
  margin-top: 10px;
  font-weight: bold;
}
.modal-body input,
.modal-body textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.btn-save, .btn-close {
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-save {
  background-color: #4caf50;
  color: white;
}
.btn-close {
  background-color: #ccc;
}
</style>
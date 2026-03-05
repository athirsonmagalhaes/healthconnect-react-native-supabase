import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export const useAppointments = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarConsultas = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("consultas")
        .select(
          `
          *,
          medicos (nome, especialidade, cidade, estado)
        `,
        )
        .order("data_consulta", { ascending: true });

      if (error) throw error;

      const formatadas = data.map((c) => ({
        id: c.id,
        medicoId: c.medico_id,
        medicoNome: c.medicos?.nome,
        especialidade: c.medicos?.especialidade,
        data: c.data_consulta.split("-").reverse().join("/"),
        horario: c.hora_consulta.substring(0, 5),
        localidade: {
          cidade: c.medicos?.cidade,
          estado: c.medicos?.estado,
        },
      }));
      setConsultas(formatadas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const salvarConsulta = async (dados, idEdicao = null) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const [dia, mes, ano] = dados.data.split("/");

      const payload = {
        medico_id: dados.medicoId,
        data_consulta: `${ano}-${mes}-${dia}`,
        hora_consulta: `${dados.horario}:00`,
        paciente_id: user?.id,
      };

      if (idEdicao) {
        const { error } = await supabase
          .from("consultas")
          .update(payload)
          .eq("id", idEdicao);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("consultas").insert([payload]);
        if (error) throw error;
      }

      await buscarConsultas();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const excluirConsulta = async (id) => {
    const { error } = await supabase.from("consultas").delete().eq("id", id);
    if (!error) await buscarConsultas();
    return !error;
  };

  return {
    consultas,
    loading,
    buscarConsultas,
    salvarConsulta,
    excluirConsulta,
  };
};
